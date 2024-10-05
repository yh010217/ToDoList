package com.todolist.backend.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "plan_classes")
@Getter
@NoArgsConstructor
@Setter
public class PlanClassesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "classes_id")
    private Long classesId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private PlanClassEntity planClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private PlanEntity plan;

    @Builder
    public PlanClassesEntity(PlanClassEntity planClass, PlanEntity plan) {
        this.planClass = planClass;
        this.plan = plan;
    }
}