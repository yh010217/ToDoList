package com.todolist.backend.service.user;

import java.util.Date;

import com.todolist.backend.domain.RefreshEntity;
import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.ReissueDTO;
import com.todolist.backend.dto.SignUpDTO;
import com.todolist.backend.controller.jwt.JWTUtil;
import com.todolist.backend.repository.refresh.RefreshRepository;
import com.todolist.backend.repository.user.UserRepository;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    @Override
    public boolean idDupCheck(String loginId) {

        return userRepository.existsByLoginId(loginId);

    }

    @Override
    public boolean emailDupCheck(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean nicknameDupCheck(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Override
    @Transactional
    public String signupCheck(SignUpDTO dto) {
        // 마무리 중복 체크하고 회원가입 시키기
        if (userRepository.existsByLoginIdOrEmailOrNickname
                (dto.getLoginId(),dto.getEmail(),dto.getNickname())) {
            return "duplicate"; // 중복이 있으면 false -> 회원가입 불가능
        } else {
            try {
                UserEntity user = UserEntity.builder()
                        .loginId(dto.getLoginId())
                        .password(bCryptPasswordEncoder
                                .encode(dto.getPassword()))
                        .email(dto.getEmail())
                        .nickname(dto.getNickname())
                        .role("ROLE_USER")
                        .build();

                userRepository.save(user);
                return "complete";
            }catch (Exception e){
                return "server error";
            }

        }
    }

    @Override
    public UserEntity getUserByUid(Long uid) {
        return userRepository.findById(uid).orElse(null);
    }

    @Override
    public String refreshTokenError(String requestRefresh) {
        if(requestRefresh == null){
            return "refresh token null";
        }
        boolean isExist = refreshRepository.existsByRefresh(requestRefresh);
        if(!isExist){
            return "invalid refresh - not stored in DB";
        }
        try{
            boolean isExpired = jwtUtil.isExpired(requestRefresh);
            if(isExpired) return "expired token";
        }catch (ExpiredJwtException e){
            deleteRefresh(requestRefresh);
            // 일단 DB엔 있었던거고 이렇게 에러 리턴이면
            // 그 다음 삭제,발급 과정이 없으니까 삭제는 해야지
            return "invalid refresh";
        }
        String category = jwtUtil.getCategory(requestRefresh);
        if(!category.equals("refresh")){
            return "invalid refresh - category invalid";
        }

        return null;
    }


    @Override
    @Transactional
    public ReissueDTO getNewTokens(String refresh) {
        deleteRefresh(refresh);

        Long uid = jwtUtil.getUid(refresh);
        UserEntity user = getUserByUid(uid);
        String nickname = user.getNickname();
        String role = user.getRole();

        String newAccessToken = jwtUtil.createAccessJwt(uid,nickname,role);
        Cookie newRefreshCookie = createRefreshJwt(uid,role);

        return new ReissueDTO(newAccessToken,newRefreshCookie);
    }

    @Override
    public Cookie createRefreshJwt(Long uid, String role) {
        Cookie refreshCookie = jwtUtil.createRefreshJwt(uid,role);

        String refreshToken = refreshCookie.getValue();
        Date refreshExp = jwtUtil.getExp(refreshToken);
        saveRefreshEntity(uid,refreshToken, refreshExp);
        return refreshCookie;
    }

    @Transactional
    @Modifying
    public boolean deleteRefresh(String refresh) {
        refreshRepository.deleteByRefresh(refresh);
        return !refreshRepository.existsByRefresh(refresh);
    }

    @Transactional
    public void saveRefreshEntity(Long uid, String refreshToken, Date expDate) {
        RefreshEntity refreshEntity = RefreshEntity.builder()
            .uid(uid)
            .refresh(refreshToken)
            .expiration(expDate.toString())
            .build();
        refreshRepository.save(refreshEntity);
    }
}
