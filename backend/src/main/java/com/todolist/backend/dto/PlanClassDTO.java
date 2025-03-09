package com.todolist.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PlanClassDTO {
	private Long classId;
	private String className;
	@Builder
	public PlanClassDTO(Long classId, String className) {
		this.classId = classId;
		this.className = className;
	}
}
