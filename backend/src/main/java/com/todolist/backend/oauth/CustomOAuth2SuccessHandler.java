package com.todolist.backend.oauth;

import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.jwt.JWTUtil;
import com.todolist.backend.repository.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User customOAuthUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customOAuthUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        try{
            UserEntity userEntity = userRepository.findBySnsId(username);
            String token = jwtUtil.createAccessJwt(userEntity.getUid(),userEntity.getNickname(),role);
            response.addCookie(createCookie("tempjwt",token));
            response.sendRedirect("/login/oauth-success");
        }catch(Exception e){
            response.sendRedirect("/login?error=로그인 과정 중 에러가 발생했습니다.");
        }
    }
    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }

}
