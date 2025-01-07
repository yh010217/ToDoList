package com.todolist.backend.controller.jwt;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/** jwt를 발급, 검증을 하는 부분 */
@Component
public class JWTUtil {
    private Long accessExpiredMs = 15*60*1000L; // 15분
    private Long refreshExpiredMs = 3*24*60*60*1000L; // 3일

    private SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}")String secret){
        this.secretKey = new SecretKeySpec
                (secret.getBytes(StandardCharsets.UTF_8),
                        Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String getCategory(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().get("category",String.class);
    }
    public Long getUid(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().get("uid",Long.class);
    }

    public String getRole(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().get("role",String.class);
    }
    public Date getExp(String token){
        return Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(token).getPayload().getExpiration();
    }
    public Boolean isExpired(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public String createAccessJwt(Long uid, String nickname, String role){
        return Jwts.builder()
                .claim("category","access")
                .claim("uid",uid)
                .claim("nickname",nickname)
                .claim("role",role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessExpiredMs))
                .signWith(secretKey)
                .compact();
    }
    public Cookie createRefreshJwt(Long uid, String role){
        Date refreshExp = new Date(System.currentTimeMillis() + refreshExpiredMs);
        String refreshToken = Jwts.builder()
                .claim("category","refresh")
                .claim("uid",uid)
                .claim("role",role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(refreshExp)
                .signWith(secretKey)
                .compact();
        return createRefreshCookie(refreshToken);
    }

    public Cookie createRefreshCookie(String value) {
        Cookie cookie = new Cookie("refresh", value);
        cookie.setMaxAge((int)(refreshExpiredMs / 1000));
        cookie.setHttpOnly(true);
        cookie.setPath("/");

        return cookie;
    }


}
