package com.todolist.backend.controller.user;

import com.todolist.backend.config.jwt.JWTUtil;
import com.todolist.backend.domain.RefreshEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.repository.user.RefreshRepository;
import com.todolist.backend.service.user.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final JWTUtil jwtUtil;
    private final UserService userService;

    private final RefreshRepository refreshRepository;

    @PostMapping("/api/login-test")
    public void loginTest(){

        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();

        System.out.println("========================");
        System.out.println(name);
        System.out.println(role);
        System.out.println("========================");
    }

    @PostMapping("/api/login/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response){
        String requestRefresh = null;
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie : cookies){
            if(cookie.getName().equals("refresh")){
                requestRefresh = cookie.getValue();
            }
        }
        if(requestRefresh == null){
            //400에러
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        try{
            jwtUtil.isExpired(requestRefresh);
        }catch (ExpiredJwtException e){
            return new ResponseEntity<>("invalid refresh", HttpStatus.BAD_REQUEST);
        }

        String category = jwtUtil.getCategory(requestRefresh);
        if(!category.equals("refresh")){
            return new ResponseEntity<>("invalid refresh", HttpStatus.BAD_REQUEST);
        }

        Boolean dbExist = refreshRepository.existsByRefresh(requestRefresh);
        if(!dbExist){
            return new ResponseEntity<>("invalid refresh", HttpStatus.BAD_REQUEST);
        }

        Long uid = jwtUtil.getUid(requestRefresh);
        UserEntity user = userService.getUserByUid(uid);
        String loginId = user.getLoginId();
        String nickname = user.getNickname();
        String role = user.getRole();
        String newAccessToken = jwtUtil.createAccessJwt(uid,loginId,nickname,role,10*60*1000L);

        int refreshExpSec = 24*60*60;
        String newRefreshToken = jwtUtil.createRefreshJwt(uid,role,refreshExpSec*1000L);

        refreshRepository.deleteByRefresh(requestRefresh);
        addRefreshEntity(uid,newRefreshToken,refreshExpSec*1000L);

        response.setHeader("Authorization","Bearer "+newAccessToken);
        response.addCookie(createCookie("refresh",newRefreshToken,refreshExpSec));

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private Cookie createCookie(String key, String value, int maxAge){
        Cookie cookie = new Cookie(key,value);
        cookie.setMaxAge(maxAge);
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        return cookie;
    }


    private void addRefreshEntity(Long uid, String refresh, Long expiredMs){
        Date date = new Date(System.currentTimeMillis() + expiredMs);
        RefreshEntity refreshEntity = RefreshEntity.builder()
                .uid(uid)
                .refresh(refresh)
                .expiration(date.toString())
                .build();
        refreshRepository.save(refreshEntity);
    }
}
