package com.todolist.backend.service.todolist;

import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;

import java.util.List;

public interface ToDoListService {

    String insertPlan(ToDoListDTO dto, Long uid);

    List<ToDoListDTO> getToDoList(Long uid);

    String changeStatus(Long uid, Long planId, Integer changeStatus);

    List<ToDoListDTO> getChildren(Long uid, Long parentPlanId);

    String deletePlan(Long planId, Long uid);
}
