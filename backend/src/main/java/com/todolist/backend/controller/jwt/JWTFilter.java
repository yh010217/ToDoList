package com.todolist.backend.controller.jwt;


import com.todolist.backend.domain.UserEntity;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if(authorization == null || !authorization.startsWith("Bearer")){
            filterChain.doFilter(request,response);

            return;
        }

        String token = authorization.split(" ")[1];

        boolean isAccessValid = isAccessValid(token);
        if(!isAccessValid){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Long uid = jwtUtil.getUid(token);
        String role = jwtUtil.getRole(token);

        UserEntity userEntity = UserEntity.builder()
                .password("temp password")
                .role(role)
                .build();
        userEntity.setUid(uid);

        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);
        Authentication authToken = new UsernamePasswordAuthenticationToken(
                customUserDetails,null,customUserDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request,response);
    }

    private boolean isAccessValid(String token){

        try{
            jwtUtil.isExpired(token);
        }catch (ExpiredJwtException e){
            e.printStackTrace();
            return false;
        }

        String category = jwtUtil.getCategory(token);
        if(!category.equals("access")){
            System.out.println("category is not access");
            return false;
        }
        return true;
    }

}
