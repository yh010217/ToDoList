package com.todolist.backend.service.todolist;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.repository.planClass.PlanClassRepository;
import com.todolist.backend.repository.planClasses.PlanClassesRepository;
import com.todolist.backend.repository.plan.PlanRepository;
import com.todolist.backend.repository.user.UserRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ToDoListServiceImpl implements ToDoListService {
	/*리파지토리 주입*/
	private final PlanRepository planRepository;
	private final PlanClassRepository planClassRepository;
	private final PlanClassesRepository planClassesRepository;
	private final UserRepository userRepository;

	private final ModelMapper modelMapper;

	private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

	private final TypeMap<PlanEntity, ToDoListDTO> planEntityToTDLTypeMap;

	public ToDoListServiceImpl(PlanRepository planRepository
		, PlanClassRepository planClassRepository, PlanClassesRepository planClassesRepository
		, UserRepository userRepository, ModelMapper modelMapper) {
		this.planRepository = planRepository;
		this.planClassRepository = planClassRepository;
		this.planClassesRepository = planClassesRepository;
		this.userRepository = userRepository;
		this.modelMapper = modelMapper;

		this.planEntityToTDLTypeMap =
			modelMapper.createTypeMap(PlanEntity.class, ToDoListDTO.class)
				.addMapping(PlanEntity::getPlanTitle, ToDoListDTO::setTitle);
	}

	@Override
	@Transactional
	public String insertPlan(ToDoListDTO dto, Long uid) {

		try {
			UserEntity user = userRepository.findById(uid).orElseThrow();

			PlanEntity parentPlan = planRepository.findById(dto.getParentPlanId()).orElse(null);

			PlanEntity planEntity = savePlan(dto, user, parentPlan);

			savePlanClass(dto, user);

			savePlanClasses(dto, planEntity, user);

			return "complete";
		} catch (EntityNotFoundException ex) {
			System.out.println("Entity not found: " + ex.getMessage());
			return "fail";
		} catch (Exception exception) {
			System.out.println(exception);
			return "fail";
		}
	}

	private PlanEntity savePlan(ToDoListDTO dto, UserEntity user, PlanEntity parentPlan) {
		PlanEntity planEntity = PlanEntity.builder()
			.user(user)
			.planTitle(dto.getTitle())
			.deadline(LocalDateTime.parse(dto.getDeadline(), formatter))
			.depth(dto.getDepth())
			.memo(dto.getMemo())
			.parentPlan(parentPlan)
			.build();

		planRepository.save(planEntity);
		return planEntity;
	}

	private void savePlanClass(ToDoListDTO dto, UserEntity user) {

		Set<String> existingClassNameSet
			= planClassRepository.findExistingClassNamesByUidAndClassNames(user, dto.getClasses());
		List<String> dtoClasses = dto.getClasses();
		List<PlanClassEntity> newPlanClassList = dtoClasses.stream()
			.filter(item -> !existingClassNameSet.contains(item))
			.map(item -> PlanClassEntity.builder().className(item).user(user).build())
			.toList();

		planClassRepository.saveAll(newPlanClassList);
	}

	private void savePlanClasses(ToDoListDTO dto, PlanEntity planEntity, UserEntity user) {
		List<PlanClassEntity> UserClassList
			= planClassRepository.findExistingClassByPlanAndClasses(user, dto.getClasses());
		List<PlanClassesEntity> toSavePlanClassesList
			= UserClassList.stream()
			.map(item -> PlanClassesEntity.builder()
				.planClass(item)
				.className(item.getClassName())
				.plan(planEntity)
				.build())
			.toList();
		planClassesRepository.saveAll(toSavePlanClassesList);
	}

	@Override
	public List<ToDoListDTO> getToDoList(Long uid, String option, String sort, String asc) {

		UserEntity tempUser = new UserEntity();
		tempUser.setUid(uid);

		List<PlanEntity> usersPlan = planRepository.getToDoListByCondition(tempUser, 1, null, option, sort, asc);

		List<ToDoListDTO> toDoList = usersPlan.stream()
			.map(planEntityToTDLTypeMap::map)
			.toList();

		return toDoList;
	}

	@Override
	public List<ToDoListDTO> getChildren(Long uid, Long parentPlanId, String option, String sort, String asc) {

		UserEntity tempUser = new UserEntity();
		tempUser.setUid(uid);

		PlanEntity parentPlan = planRepository.findById(parentPlanId).orElse(null);
		Integer parentDepth = parentPlan.getDepth();

		List<PlanEntity> usersPlan = planRepository.getToDoListByCondition(tempUser, parentDepth + 1, parentPlan,
			option, sort, asc);

		List<ToDoListDTO> toDoList = usersPlan.stream()
			.map(planEntityToTDLTypeMap::map)
			.toList();

		return toDoList;
	}

	@Override
	public String deletePlan(Long planId, Long uid) {

		UserEntity tempUser = new UserEntity();
		tempUser.setUid(uid);
		//그냥... 최소한의 보안정도...? 바로 deleteBy 해도 되긴 했겠지만...?
		PlanEntity planEntity = planRepository.findById(planId).orElse(null);
		if (planEntity != null && planEntity.getUser().getUid().equals(uid)) {
			planRepository.delete(planEntity);
			return "complete";
		}
		return "fail";
	}

	@Override
	public ToDoListDTO getToDoDetail(Long uid, Long planId) {
		PlanEntity planEntity = planRepository.findById(planId).orElseThrow(EntityExistsException::new);
		ToDoListDTO toDoDetail = planEntityToTDLTypeMap.map(planEntity);

		List<String> classes = planClassesRepository.findByPlan(planEntity)
			.stream()
			.map(item -> item.getClassName())
			.toList();
		toDoDetail.setClasses(classes);
		return toDoDetail;
	}

	@Override
	@Transactional
	public String modifyToDoList(ToDoListDTO dto, Long uid) {
		try {

			PlanEntity planEntity = planRepository.findById(dto.getPlanId()).orElseThrow();

			UserEntity user = userRepository.findById(uid).orElseThrow();
			if (!user.equals(planEntity.getUser())) {
				throw new RuntimeException();
			}

			modifyPlan(dto, planEntity);

			// 현재 다 지우는 거로 돼있음 savePlanClasses 에서 다시 넣어주는 걸 사용하기 위해서
			// 만약 필요한 것만 지우고 넣는게 더 효율적이라면 이 메서드와 savePlanClasses 메서드를 수정하기로
			deletePlanClasses(dto, planEntity);

			savePlanClass(dto, user);

			savePlanClasses(dto, planEntity, user);

			return "complete";
		} catch (Exception exception) {
			return "fail";
		}
	}

	private void modifyPlan(ToDoListDTO dto, PlanEntity planEntity) {
		if (!planEntity.getPlanTitle().equals(dto.getTitle())) {
			planEntity.setPlanTitle(dto.getTitle());
		}
		if (!planEntity.getDeadline().equals(dto.getDeadline())) {
			planEntity.setDeadline(LocalDateTime.parse(dto.getDeadline(), formatter));
		}
		if (!planEntity.getMemo().equals(dto.getMemo())) {
			planEntity.setMemo(dto.getMemo());
		}
		planRepository.save(planEntity);
	}

	private void deletePlanClasses(ToDoListDTO dto, PlanEntity planEntity) {
		List<PlanClassesEntity> thisPlanClassesList = planClassesRepository.findByPlan(planEntity);
/*
		원래는 이게 필요한 것만 지워서 나중에 삽입할 때도 필요한 것만 넣을 수 있긴 한데,
		이미 존재하는 클래스를 다 지우고 다시 넣는게 더 간단할 것 같아서 일단 다 지우는 걸로
		List<PlanClassesEntity> toDeleteList = new ArrayList<>();
		for (PlanClassesEntity item : thisPlanClassesList) { // 기존 엔티티 리스트를 기준으로
			if (!dto.getClasses().contains(item.getClassName())) { // DTO에 없는 경우만 삭제 대상
				toDeleteList.add(item);
			}
		}
*/

		planClassesRepository.deleteAll(thisPlanClassesList);
	}

	@Override
	public String changeStatus(Long uid, Long planId, Integer changeStatus) {

		PlanEntity planEntity = planRepository.findById(planId).orElse(null);

		if (planEntity != null && planEntity.getUser().getUid().equals(uid)) {
			planEntity.setStatus(changeStatus);
			try {
				planRepository.save(planEntity);
				return "complete";
			} catch (Exception e) {
				System.out.println(e);
			}
		}
		return "fail";
	}

}
