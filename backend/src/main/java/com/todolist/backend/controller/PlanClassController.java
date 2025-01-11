package com.todolist.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todolist.backend.annotaion.LoginUser;
import com.todolist.backend.dto.PlanClassDTO;
import com.todolist.backend.service.plan_class.PlanClassService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/plan-class")
@RequiredArgsConstructor
public class PlanClassController {
	private final PlanClassService planClassService;
	@GetMapping("/all")
	public List<PlanClassDTO> getAllPlanClass(@LoginUser Long uid) {
		return planClassService.getAllPlanClass(uid);
	}
}
