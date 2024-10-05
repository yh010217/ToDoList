package com.todolist.backend.repository.planClass;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todolist.backend.domain.PlanClassEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class PlanClassQueryDSLImpl implements PlanClassQueryDSL{

    private final JPAQueryFactory queryFactory;

    /*필요하면 EntityManager 가져오기*/
    /*
    @PersistenceContext
    private EntityManager entityManager;

    public void saveClassBatch(List<PlanClassEntity> classEntities){

    }*/


}
