package com.todolist.backend.dto;


import jakarta.persistence.Column;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class ToDoListDTO {
    private String title;
    private LocalDateTime deadline;
    private List<String> classes;
    private Integer depth;
    private String memo;

    private Long planId;

    /** 0 미완료, 1 완료, 2 취소, 3삭제 추후 enum 타입으로 바꾸자*/
    private Integer status;
    private Long parentPlanId;
    private Integer score;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
