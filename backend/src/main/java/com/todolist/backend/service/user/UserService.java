package com.todolist.backend.service.user;

import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ReissueDTO;
import com.todolist.backend.dto.SignUpDTO;

import jakarta.servlet.http.Cookie;

public interface UserService {
    boolean idDupCheck(String id);
    boolean emailDupCheck(String email);
    boolean nicknameDupCheck(String nickname);
    String signupCheck(SignUpDTO dto);
    UserEntity getUserByUid(Long uid);

    String refreshTokenError(String requestRefresh);
    boolean deleteRefresh(String refresh);
    ReissueDTO getNewTokens(String refresh);
	Cookie createRefreshJwt(Long uid, String role);
}
