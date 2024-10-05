package com.todolist.backend.repository.plan;

import com.todolist.backend.domain.PlanClassesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanClassesRepository
        extends JpaRepository<PlanClassesEntity,Long> {

}
