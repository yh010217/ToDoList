package com.todolist.backend.repository.planClass;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PlanClassRepository
        extends JpaRepository<PlanClassEntity, Long>, PlanClassQueryDSL {
    Set<PlanClassEntity> findByUser(UserEntity user);

}
