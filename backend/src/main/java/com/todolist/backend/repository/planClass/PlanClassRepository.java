package com.todolist.backend.repository.planClass;

import com.todolist.backend.domain.PlanClassEntity;
import com.todolist.backend.domain.PlanClassesEntity;
import com.todolist.backend.domain.PlanEntity;
import com.todolist.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PlanClassRepository
        extends JpaRepository<PlanClassEntity, Long>, PlanClassQueryDSL {
    Set<PlanClassEntity> findByUser(UserEntity user);

    @Query("SELECT p.className FROM PlanClassEntity p WHERE p.user = :user AND p.className IN :classNames")
    Set<String> findExistingClassNamesByUidAndClassNames(
        @Param("user") UserEntity user,
        @Param("classNames") List<String> classNames);

    @Query("SELECT p FROM PlanClassEntity p WHERE p.user = :user AND p.className IN :classNames")
    List<PlanClassEntity> findExistingClassByPlanAndClasses(
        @Param("user") UserEntity user,
        @Param("classNames") List<String> classes);
}
