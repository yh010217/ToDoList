package com.todolist.backend.service.todolist.plan;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.repository.plan.PlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ToDoListPlanService {
	private final PlanRepository planRepository;

	private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

	public PlanEntity savePlan(ToDoListDTO dto, UserEntity user, PlanEntity parentPlan) {
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

	public void modifyPlan(ToDoListDTO dto, PlanEntity planEntity) {
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


}
