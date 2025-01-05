package com.todolist.backend.repository.planClasses;

import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PlanClassesRepository
        extends JpaRepository<PlanClassesEntity,Long> {

    List<PlanClassesEntity> findByPlan(PlanEntity planEntity);

    @Query("SELECT pcs.className FROM PlanClassesEntity pcs WHERE pcs.plan = :plan")
    Set<String> findClassNameByPlan(@Param("plan") PlanEntity planEntity);
}
