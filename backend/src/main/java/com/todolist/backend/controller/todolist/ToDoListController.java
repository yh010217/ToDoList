package com.todolist.backend.controller.todolist;

import com.todolist.backend.config.jwt.CustomUserDetails;
import com.todolist.backend.controller.GetUserBySecurityContext;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ToDoListDTO;
import com.todolist.backend.service.todolist.ToDoListService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Clock;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class ToDoListController {
    private final ToDoListService toDoListService;

    @PostMapping("/add")
    public String createToDoList(@RequestBody ToDoListDTO dto) {
        //걍... 9 더해...
        dto.setDeadline(dto.getDeadline().plusHours(9l));

        Long uid = GetUserBySecurityContext.getUid();
        String insertResult = toDoListService.insertPlan(dto, uid);
        return insertResult;
    }

    //후에 페이징, 조건식은 할수도
    @GetMapping("/list")
    public List<ToDoListDTO> getToDoList(){

        Long uid = GetUserBySecurityContext.getUid();
        List<ToDoListDTO> toDoList = toDoListService.getToDoList(uid);
        return toDoList;
    }

    @GetMapping("/get-children/{parent-plan}")
    public List<ToDoListDTO> getChild(@PathVariable("parent-plan") Long parentPlanId){

        Long uid = GetUserBySecurityContext.getUid();
        List<ToDoListDTO> toDoList = toDoListService.getChildren(uid,parentPlanId);
        return toDoList;
    }

    @PostMapping("/change-status")
    public String changeStatus(@RequestBody Map<String, Object> requestBody){

        Long uid = GetUserBySecurityContext.getUid();
        String planIdStr = (String) requestBody.get("planId");
        Long planId = Long.parseLong(planIdStr);
        Integer changeStatus = (Integer) requestBody.get("status");
        String complete = toDoListService.changeStatus(uid,planId,changeStatus);
        return complete;
    }

    @DeleteMapping("/delete/{plan-id}")
    public String deletePlan(@PathVariable("plan-id") Long planId){

        Long uid = GetUserBySecurityContext.getUid();
        String complete = toDoListService.deletePlan(planId,uid);
        return complete;
    }

}
