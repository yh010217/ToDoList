package com.todolist.backend.service.user;

import com.todolist.backend.dto.SignUpDTO;
import org.springframework.stereotype.Service;

public interface UserService {
    boolean idDupCheck(String id);
    boolean emailDupCheck(String email);
    boolean nicknameDupCheck(String nickname);
    String signupCheck(SignUpDTO dto);
}
