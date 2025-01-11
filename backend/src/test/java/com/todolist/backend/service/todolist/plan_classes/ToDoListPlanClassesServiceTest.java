package com.todolist.backend.service.todolist.plan_classes;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.repository.plan.PlanRepository;

@SpringBootTest
@Transactional
class ToDoListPlanClassesServiceTest {
	@Autowired
	private ToDoListPlanClassesService toDoListPlanClassesService;

	@Autowired
	private PlanRepository planRepository;
	/*@Test
	public void testSavePlanClasses() {
		PlanEntity plan = planRepository.findById(146L).orElse(null);
		int deleteRow = toDoListPlanClassesService.deleteNotReferencedPlanClass(plan);
		System.out.println(deleteRow);
	}*/

}