package com.todolist.backend.controller;

import com.todolist.backend.config.jwt.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class GetUserBySecurityContext {
    public static Long getUid(){
        System.out.println("getUid");
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUid();
    }
}
