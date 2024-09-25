package com.todolist.backend.service.user;

import org.springframework.stereotype.Service;

public interface UserService {
    boolean idDupCheck(String id);
    boolean emailDupCheck(String email);
    boolean nicknameDupCheck(String nickname);
}
