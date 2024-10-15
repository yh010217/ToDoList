package com.todolist.backend.config.jwt;


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

        try{
            jwtUtil.isExpired(token);
        }catch (ExpiredJwtException e){

            //401 으로 프론트에게 넘겨주고 다음 행위를 하게 유도
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(token);
        if(!category.equals("access")){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Long uid = jwtUtil.getUid(token);
        String loginId = jwtUtil.getLoginId(token);
        String role = jwtUtil.getRole(token);

        UserEntity userEntity = UserEntity.builder()
                .loginId(loginId)
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
}
