package com.todolist.backend.repository.plan;

import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository
        extends JpaRepository<PlanEntity,Long>,PlanQueryDSL{
	@Query("SELECT p FROM PlanEntity p JOIN FETCH p.planClasses WHERE p.planId = :planId")
	PlanEntity findWithClassesById(@Param("planId") Long planId);
	//List<PlanEntity> findByUser(UserEntity tempUser);


}
