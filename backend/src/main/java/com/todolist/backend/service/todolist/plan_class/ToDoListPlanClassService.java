package com.todolist.backend.service.todolist.plan_class;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.repository.planClass.PlanClassRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ToDoListPlanClassService {

	private final PlanClassRepository planClassRepository;

	public void savePlanClass(ToDoListDTO dto, UserEntity user) {

		Set<String> existingClassNameSet
			= planClassRepository.findExistingClassNamesByUidAndClassNames(user, dto.getClasses());
		List<String> dtoClasses = dto.getClasses();
		List<PlanClassEntity> newPlanClassList = dtoClasses.stream()
			.filter(item -> !existingClassNameSet.contains(item))
			.map(item -> PlanClassEntity.builder().className(item).user(user).build())
			.toList();

		planClassRepository.saveAll(newPlanClassList);
	}

	public void check20UnderClass(UserEntity user) throws RuntimeException {
		if(planClassRepository.countByUser(user) > 20) {
			throw new RuntimeException("Class size is over 20");
		}
	}
}
