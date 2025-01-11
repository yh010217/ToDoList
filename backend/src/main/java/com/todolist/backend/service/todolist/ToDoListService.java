package com.todolist.backend.service.todolist;

import com.todolist.backend.dto.ToDoListDTO;

import java.util.List;

public interface ToDoListService {

    String insertPlan(ToDoListDTO dto, Long uid);

    List<ToDoListDTO> getToDoList(Long uid,String option, String sort, String asc);

    String changeStatus(Long uid, Long planId, Integer changeStatus);

    List<ToDoListDTO> getChildren(Long uid, Long parentPlanId,String option, String sort, String asc);

    String deletePlan(Long planId, Long uid);

    ToDoListDTO getToDoDetail(Long uid, Long planId);

    String modifyToDoList(ToDoListDTO dto, Long uid);
}
