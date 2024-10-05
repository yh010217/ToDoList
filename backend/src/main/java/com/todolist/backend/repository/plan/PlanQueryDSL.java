package com.todolist.backend.repository.plan;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;

import java.util.List;

public interface PlanQueryDSL {
    List<PlanEntity> getToDoList(UserEntity tempUser, Integer depth, PlanEntity parentPlan);
}
