package com.todolist.backend.domain;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "plan")
@Getter
@NoArgsConstructor
@Setter
@EntityListeners(AuditingEntityListener.class)
public class PlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long planId;

    @Column(name="plan_title",nullable = false)
    private String planTitle;

    /** 0 미완료, 1 완료, 2 취소, 3삭제 추후 enum 타입으로 바꾸자*/
    @Column
    private Integer status = 0;// 기본값

    @Column
    private LocalDateTime deadline;

    /** -1이면 점수 없음 */
    @Column
    private Integer score = -1;

    @Column
    private String memo;

    @Column
    private Integer depth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_plan")
    private PlanEntity parentPlan;


    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column
    private LocalDateTime updatedAt;


    @Builder
    public PlanEntity(String planTitle, LocalDateTime deadline, String memo, Integer depth, UserEntity user, PlanEntity parentPlan) {
        this.planTitle = planTitle;
        this.deadline = deadline;
        this.memo = memo;
        this.depth = depth;
        this.user = user;
        this.parentPlan = parentPlan;
    }

}
