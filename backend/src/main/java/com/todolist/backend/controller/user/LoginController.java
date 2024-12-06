package com.todolist.backend.controller.user;

import com.todolist.backend.jwt.JWTUtil;
import com.todolist.backend.domain.RefreshEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.repository.user.RefreshRepository;
import com.todolist.backend.service.user.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

    @PostMapping("/api/oauth/cookie-to-header")
    public void CookieToHeader(HttpServletRequest request, HttpServletResponse response){

        //왜 생기는 지 몰라도 session이 생김.
        HttpSession session = request.getSession(false);
        if(session != null) session.invalidate();

        System.out.println(session);
        String accessToken = null;
        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("tempjwt")) {
                    accessToken = cookie.getValue();
                }
                if(cookie.getName().equals("JSESSIONID")){
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                }
            }
            System.out.println(accessToken);
        }catch (NullPointerException ne){
            System.out.println("no cookie or no refresh");
        }

        if(accessToken!=null){
            Long uid = jwtUtil.getUid(accessToken);
            String role = jwtUtil.getRole(accessToken);
            String refreshToken = jwtUtil.createRefreshJwt(uid,role);
            addRefreshEntity(uid,refreshToken);
            response.addHeader("Authorization","Bearer "+accessToken);
            response.addCookie(createRefreshCookie("refresh",refreshToken));
            response.setStatus(HttpStatus.OK.value());
        }
    }

    @PostMapping("/api/login/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response){
        String requestRefresh = null;
        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    requestRefresh = cookie.getValue();
                }
            }
        }catch (NullPointerException ne){
            System.out.println("no cookie or no refresh");
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
        String nickname = user.getNickname();
        String role = user.getRole();
        String newAccessToken = jwtUtil.createAccessJwt(uid,nickname,role);

        String newRefreshToken = jwtUtil.createRefreshJwt(uid,role);

        refreshRepository.deleteByRefresh(requestRefresh);
        addRefreshEntity(uid,newRefreshToken);

        response.setHeader("Authorization","Bearer "+newAccessToken);
        response.addCookie(createRefreshCookie("refresh",newRefreshToken));

        return new ResponseEntity<>(HttpStatus.OK);
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
