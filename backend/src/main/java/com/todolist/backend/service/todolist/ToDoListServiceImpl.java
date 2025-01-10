package com.todolist.backend.service.todolist;

import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.repository.plan.PlanRepository;
import com.todolist.backend.repository.user.UserRepository;
import com.todolist.backend.service.todolist.plan.ToDoListPlanService;
import com.todolist.backend.service.todolist.plan_class.ToDoListPlanClassService;
import com.todolist.backend.service.todolist.plan_classes.ToDoListPlanClassesService;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.modelmapper.spi.MappingContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ToDoListServiceImpl implements ToDoListService {
	/*리파지토리 주입*/
	private final PlanRepository planRepository;
	private final UserRepository userRepository;

	private final TypeMap<PlanEntity, ToDoListDTO> planEntityToTDLTypeMap;

	private final ToDoListPlanService toDoListPlanService;
	private final ToDoListPlanClassService toDoListPlanClassService;
	private final ToDoListPlanClassesService toDoListPlanClassesService;

	public ToDoListServiceImpl(PlanRepository planRepository
		, UserRepository userRepository
		, ModelMapper modelMapper
		, ToDoListPlanService toDoListPlanService
		, ToDoListPlanClassService toDoListPlanClassService
		, ToDoListPlanClassesService toDoListPlanClassesService) {
		this.planRepository = planRepository;
		this.userRepository = userRepository;

		this.planEntityToTDLTypeMap =
			modelMapper.createTypeMap(PlanEntity.class, ToDoListDTO.class)
				.addMapping(PlanEntity::getPlanTitle, ToDoListDTO::setTitle)
				.addMappings(mapper -> mapper.using(planClassesToStringListConverter())
					.map(PlanEntity::getPlanClasses, ToDoListDTO::setClasses));

		this.toDoListPlanService = toDoListPlanService;
		this.toDoListPlanClassService = toDoListPlanClassService;
		this.toDoListPlanClassesService = toDoListPlanClassesService;
	}

	private Converter<List<PlanClassesEntity>, List<String>> planClassesToStringListConverter() {
		return ctx -> {
			List<PlanClassesEntity> source = ctx.getSource();
			if (source == null)
				return new ArrayList<>(); // null일 경우 빈 리스트 반환
			return source.stream()
				.map(PlanClassesEntity::getClassName) // className으로 변환
				.toList();
		};
	}

	@Override
	@Transactional
	public String insertPlan(ToDoListDTO dto, Long uid) {
		try {
			if (dto.getClasses().size() > 10)
				throw new RuntimeException("Class size is over 10");

			UserEntity user = userRepository.findById(uid).orElseThrow();

			PlanEntity parentPlan = planRepository.findById(dto.getParentPlanId()).orElse(null);

			PlanEntity planEntity = toDoListPlanService.savePlan(dto, user, parentPlan);

			toDoListPlanClassService.savePlanClass(dto, user);

			toDoListPlanClassesService.savePlanClasses(dto, planEntity, user);

			toDoListPlanClassService.check20UnderClass(user);

			return "complete";
		} catch (EntityNotFoundException ex) {
			System.out.println("Entity not found: " + ex.getMessage());
			return "fail";
		} catch (Exception exception) {
			System.out.println(exception);
			return "fail";
		}
	}

	@Override
	public List<ToDoListDTO> getToDoList(Long uid, String option, String sort, String asc) {

		UserEntity user = userRepository.findById(uid).orElseThrow();

		List<ToDoListDTO> toDoList = planRepository
			.getToDoListByCondition(user, 1, null, option, sort, asc)
			.stream()
			.map(planEntityToTDLTypeMap::map)
			.toList();

		return toDoList;
	}

	@Override
	public List<ToDoListDTO> getChildren(Long uid, Long parentPlanId, String option, String sort, String asc) {

		UserEntity user = userRepository.findById(uid).orElseThrow();

		PlanEntity parentPlan = planRepository.findById(parentPlanId).orElse(null);
		Integer parentDepth = parentPlan.getDepth();

		List<ToDoListDTO> toDoList = planRepository
			.getToDoListByCondition(user, parentDepth + 1, parentPlan, option, sort, asc)
			.stream()
			.map(planEntityToTDLTypeMap::map)
			.toList();

		return toDoList;
	}

	@Override
	@Transactional
	public String deletePlan(Long planId, Long uid) {
		PlanEntity planEntity = planRepository.findWithClassesById(planId);
		if (planEntity != null && planEntity.getUser().getUid().equals(uid)) {
			planRepository.delete(planEntity);
			toDoListPlanClassesService.deleteNotReferencedPlanClass(planEntity);
			return "complete";
		}
		return "fail";
	}

	@Override
	public ToDoListDTO getToDoDetail(Long uid, Long planId) {
		PlanEntity planEntity = planRepository.findById(planId).orElseThrow(EntityExistsException::new);
		ToDoListDTO toDoDetail = planEntityToTDLTypeMap.map(planEntity);
		List<String> classes = toDoListPlanClassesService.getPlanClasses(planEntity);
		toDoDetail.setClasses(classes);
		return toDoDetail;
	}

	@Override
	@Transactional
	public String modifyToDoList(ToDoListDTO dto, Long uid) {
		try {
			if (dto.getClasses().size() > 10)
				throw new RuntimeException("Class size is over 10");

			UserEntity user = userRepository.findById(uid).orElseThrow();

			PlanEntity planEntity = planRepository.findById(dto.getPlanId()).orElseThrow();

			if (!user.equals(planEntity.getUser())) {
				throw new RuntimeException("Different user");
			}

			toDoListPlanService.modifyPlan(dto, planEntity);

			toDoListPlanClassService.savePlanClass(dto, user);

			toDoListPlanClassesService.modifyPlanClasses(dto, planEntity, user);

			toDoListPlanClassService.check20UnderClass(user);

			return "complete";
		} catch (Exception exception) {
			return "fail";
		}
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
