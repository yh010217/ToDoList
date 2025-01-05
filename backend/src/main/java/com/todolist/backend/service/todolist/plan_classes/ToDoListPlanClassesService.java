package com.todolist.backend.service.todolist.plan_classes;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.repository.planClass.PlanClassRepository;
import com.todolist.backend.repository.planClasses.PlanClassesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ToDoListPlanClassesService {
	private final PlanClassesRepository planClassesRepository;
	private final PlanClassRepository planClassRepository;

	/**toDoListPlanClassService.savePlanClass(dto,user) 가 완료 돼있으니깐 할 수 있는 거임*/
	public void savePlanClasses(ToDoListDTO dto, PlanEntity planEntity, UserEntity user) {
		List<PlanClassEntity> userClassList
			= planClassRepository.findExistingClassByPlanAndClasses(user, dto.getClasses());
		List<PlanClassesEntity> toSavePlanClassesList
			= userClassList.stream()
			.map(item -> PlanClassesEntity.builder()
				.planClass(item)
				.className(item.getClassName())
				.plan(planEntity)
				.build())
			.toList();
		planClassesRepository.saveAll(toSavePlanClassesList);
	}

	public List<String> getPlanClasses(PlanEntity planEntity) {
		List<PlanClassesEntity> thisPlanClassesList = planClassesRepository.findByPlan(planEntity);
		return thisPlanClassesList.stream()
			.map(item -> item.getClassName())
			.toList();
	}

	@Transactional
	public void modifyPlanClasses(ToDoListDTO dto, PlanEntity planEntity, UserEntity user) {
		//dto에 새로 추가된 클래스 저장
		saveNecessaryPlanClasses(dto, planEntity, user);
		//dto 에 안들어 있는 기존 클래스 삭제
		deletePlanClasses(dto, planEntity);
	}

	private void saveNecessaryPlanClasses(ToDoListDTO dto, PlanEntity planEntity, UserEntity user) {
		List<PlanClassEntity> userClassList
			= planClassRepository.findExistingClassByPlanAndClasses(user, dto.getClasses());
		Map<String, PlanClassEntity> nameToPlanClassEntityMap
			= userClassList.stream()
			.collect(Collectors.toMap(PlanClassEntity::getClassName, item -> item));

		Set<String> existingClassNameSet = planClassesRepository.findClassNameByPlan(planEntity);

		List<PlanClassesEntity> toSaveList = new ArrayList<>();
		for (String dtoClassName : dto.getClasses()) {
			if (!existingClassNameSet.contains(dtoClassName)) {
				toSaveList.add(PlanClassesEntity.builder()
					.planClass(nameToPlanClassEntityMap.get(dtoClassName))
					.plan(planEntity)
					.className(dtoClassName).build());
			}
		}
		if (!toSaveList.isEmpty())
			planClassesRepository.saveAll(toSaveList);
	}

	public void deletePlanClasses(ToDoListDTO dto, PlanEntity planEntity) {
		List<PlanClassesEntity> thisPlanClassesList = planClassesRepository.findByPlan(planEntity);
		List<String> dtoClasses = dto.getClasses();
		List<PlanClassesEntity> toDeleteList = new ArrayList<>();
		for (PlanClassesEntity item : thisPlanClassesList) { // 기존 엔티티 리스트를 기준으로
			if (!dtoClasses.contains(item.getClassName())) { // DTO에 없는 경우만 삭제 대상
				toDeleteList.add(item);
			}
		}
		if (!toDeleteList.isEmpty())
			planClassesRepository.deleteAll(toDeleteList);
	}
}
