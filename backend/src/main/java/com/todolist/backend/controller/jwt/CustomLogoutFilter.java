package com.todolist.backend.controller.jwt;

import com.todolist.backend.service.user.UserService;

import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

/** 로그아웃필터와 비슷하게 작동하게 만든 필터 */
public class CustomLogoutFilter extends GenericFilterBean {
    private final UserService userService;

    public CustomLogoutFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request,(HttpServletResponse) response,chain);
    }
    public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)throws IOException, ServletException {
        String requestUri = request.getRequestURI();
        String requestMethod = request.getMethod();
        if(!requestUri.equals("/api/logout") || !requestMethod.equals("POST")){
            filterChain.doFilter(request,response);
            return;
        }

        String requestRefresh = null;
        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    requestRefresh = cookie.getValue();
                }
            }
        }catch (NullPointerException ne){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String refreshTokenError = userService.refreshTokenError(requestRefresh);
        if(refreshTokenError != null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        userService.deleteRefresh(requestRefresh);

        Cookie cookie = new Cookie("refresh",null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }

}
