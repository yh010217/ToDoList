package com.todolist.backend.service.plan_class;

import java.util.List;

import org.springframework.stereotype.Service;

import com.todolist.backend.dto.PlanClassDTO;

public interface PlanClassService {

	List<PlanClassDTO> getAllPlanClass(Long uid);
}
