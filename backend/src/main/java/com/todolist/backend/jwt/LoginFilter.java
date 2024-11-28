package com.todolist.backend.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todolist.backend.domain.RefreshEntity;
import com.todolist.backend.dto.LoginDTO;
import com.todolist.backend.repository.user.RefreshRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public LoginFilter(AuthenticationManager authenticationManager
            ,JWTUtil jwtUtil, RefreshRepository refreshRepository){
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        setFilterProcessesUrl("/api/login");
        this.refreshRepository = refreshRepository;
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        UsernamePasswordAuthenticationToken authToken;
        try {
            LoginDTO loginDTO = new ObjectMapper().readValue(request.getInputStream(), LoginDTO.class);
            System.out.println(loginDTO);
            authToken = new UsernamePasswordAuthenticationToken
                    (loginDTO.getLoginId(),loginDTO.getPassword(),null);
        }catch (IOException e){
            System.out.println("왜 안되노");
            authToken = new UsernamePasswordAuthenticationToken("","",null);
        }


        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        Long uid = customUserDetails.getUid();
        String loginId = customUserDetails.getUsername();
        String nickname= customUserDetails.getNickname();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends  GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();

        String role = auth.getAuthority();


        String accessJwt = jwtUtil.createAccessJwt(uid,nickname,role);//10분
        String refreshJwt = jwtUtil.createRefreshJwt(uid, role);//3일

        addRefreshEntity(uid,refreshJwt);

        response.addHeader("Authorization","Bearer "+accessJwt);
        response.addCookie(createRefreshCookie("refresh",refreshJwt));
        response.setStatus(HttpStatus.OK.value());
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {

        response.setStatus(401);
    }

    private Cookie createRefreshCookie(String key, String value){
        Cookie cookie = new Cookie(key,value);
        cookie.setMaxAge(3*24*60*60);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        return cookie;
    }

    private void addRefreshEntity(Long uid, String refresh){

        Long refreshExpSec = 3*24*60*60*1000L;
        Date date = new Date(System.currentTimeMillis() + refreshExpSec);
        RefreshEntity refreshEntity = RefreshEntity.builder()
                .uid(uid)
                .refresh(refresh)
                .expiration(date.toString())
                .build();
        refreshRepository.save(refreshEntity);
    }

}
