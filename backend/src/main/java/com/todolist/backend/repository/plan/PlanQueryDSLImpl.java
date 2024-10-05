package com.todolist.backend.repository.plan;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todolist.backend.domain.PlanEntity;
import static com.todolist.backend.domain.QPlanEntity.planEntity;
import com.todolist.backend.domain.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class PlanQueryDSLImpl implements PlanQueryDSL{

    private final JPAQueryFactory queryFactory;

    /*필요하면 EntityManager 가져오기*/
    // @PersistenceContext
    // private final EntityManager entityManager;

    /** 조건까지 붙여서 받아올 수 있게하기 */
    @Override
    public List<PlanEntity> getToDoList(UserEntity tempUser, Integer depth, PlanEntity parentPlan) {

        //일단 깊이는 모두가 조건식으로 들어갈거니깐...
        BooleanExpression listRange = planEntity.depth.eq(depth);
        if(depth != 1){
            listRange = listRange.and(planEntity.parentPlan.eq(parentPlan));
        }
        List<PlanEntity> toDoList =
                queryFactory.select(planEntity)
                        .from(planEntity)
                        .where(listRange)
                        .orderBy(planEntity.deadline.asc())
                        .fetch();

        return toDoList;
    }
}
