package com.todolist.backend.controller;

import com.todolist.backend.dto.ReissueDTO;
import com.todolist.backend.controller.jwt.JWTUtil;
import com.todolist.backend.service.user.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final JWTUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/api/oauth/cookie-to-header")
    public void CookieToHeader(HttpServletRequest request, HttpServletResponse response){

        //왜 생기는 지 몰라도 session이 생김.
        HttpSession session = request.getSession(false);
        if(session != null) session.invalidate();

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
        }catch (NullPointerException ne){
            System.out.println("no cookie or no refresh");
        }

        if(accessToken!=null){
            Long uid = jwtUtil.getUid(accessToken);
            String role = jwtUtil.getRole(accessToken);
            Cookie refreshCookie = userService.createRefreshJwt(uid,role);
            response.addHeader("Authorization","Bearer "+accessToken);
            response.addCookie(refreshCookie);
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
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        String refreshTokenError = userService.refreshTokenError(requestRefresh);
        if(refreshTokenError != null){
            return new ResponseEntity<>(refreshTokenError, HttpStatus.BAD_REQUEST);
        }

        ReissueDTO newTokens = userService.getNewTokens(requestRefresh);

        response.setHeader("Authorization"
            ,"Bearer "+newTokens.getNewAccessToken());
        response.addCookie(newTokens.getNewRefreshCookie());

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
