package com.todolist.backend.repository.planClasses;

import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanClassesRepository
        extends JpaRepository<PlanClassesEntity,Long> {

    List<PlanClassesEntity> findByPlan(PlanEntity planEntity);
}
