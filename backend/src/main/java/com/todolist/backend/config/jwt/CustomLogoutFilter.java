package com.todolist.backend.config.jwt;

import com.todolist.backend.repository.user.RefreshRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

/** 로그아웃필터와 비슷하게 작동하게 만든 필터 */
public class CustomLogoutFilter extends GenericFilterBean {
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public CustomLogoutFilter(JWTUtil jwtUtil, RefreshRepository refreshRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request,(HttpServletResponse) response,chain);
    }
    public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)throws IOException, ServletException {

        String requestUri = request.getRequestURI();
        if(!requestUri.equals("/api/logout")){
            filterChain.doFilter(request,response);
            return;
        }
        String requestMethod = request.getMethod();
        if(!requestMethod.equals("POST")){
            filterChain.doFilter(request,response);
            return;
        }


        String requestRefresh = null;
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies){
            if(cookie.getName().equals("refresh")){
                requestRefresh = cookie.getValue();
            }
        }

        if(requestRefresh == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try{
            jwtUtil.isExpired(requestRefresh);
        }catch (ExpiredJwtException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String category = jwtUtil.getCategory(requestRefresh);
        if(!category.equals("refresh")){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        Boolean dbExist = refreshRepository.existsByRefresh(requestRefresh);
        if(!dbExist){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        refreshRepository.deleteByRefresh(requestRefresh);

        Cookie cookie = new Cookie("refresh",null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
