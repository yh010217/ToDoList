package com.todolist.backend.controller;

import com.todolist.backend.config.jwt.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;

public class GetUserBySecurityContext {
    public static Long getUid(){
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUid();
    }
}
