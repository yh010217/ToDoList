package com.todolist.backend.repository.plan;

import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository
        extends JpaRepository<PlanEntity,Long>,PlanQueryDSL{
    //List<PlanEntity> findByUser(UserEntity tempUser);

}
