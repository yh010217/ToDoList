package com.todolist.backend.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/** jwt를 발급, 검증을 하는 부분 */
@Component
public class JWTUtil {


    private Long accessExpiredMs = 10*60*1000L; // 10분
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

    public String getLoginId(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().get("loginId",String.class);
    }
    public String getNickname(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().get("nickname",String.class);
    }
    public String getRole(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token).getPayload().get("role",String.class);
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
    public String createRefreshJwt(Long uid, String role){
        return Jwts.builder()
                .claim("category","refresh")
                .claim("uid",uid)
                .claim("role",role)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + refreshExpiredMs))
                .signWith(secretKey)
                .compact();
    }

}
