package com.todolist.backend.dto;

import jakarta.servlet.http.Cookie;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReissueDTO {
	private String newAccessToken;
	private Cookie newRefreshCookie;
}
