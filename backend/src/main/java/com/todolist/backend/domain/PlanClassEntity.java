package com.todolist.backend.domain;

/*

CREATE TABLE plan_class(
	class_id BIGINT(20) PRIMARY KEY AUTO_INCREMENT
	,class_name VARCHAR(30) NOT NULL
	,uid BIGINT(20)
	,CONSTRAINT fk_class_user FOREIGN KEY (uid) REFERENCES user(uid)
   	ON DELETE CASCADE ON UPDATE CASCADE
)
엔티티 만들어줘

*/


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "plan_class")
@Getter
@NoArgsConstructor
@Setter
public class PlanClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Long classId;

    @Column(name="class_name",nullable = false)
    private String className;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uid")
    private UserEntity user;

    @Builder
    public PlanClassEntity(String className,UserEntity user) {
        this.className = className;
        this.user = user;
    }

}