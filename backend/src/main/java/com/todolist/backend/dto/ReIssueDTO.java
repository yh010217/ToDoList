package com.todolist.backend.dto;

import jakarta.servlet.http.Cookie;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReIssueDTO {
	private String newAccessToken;
	private Cookie newRefreshCookie;
}
