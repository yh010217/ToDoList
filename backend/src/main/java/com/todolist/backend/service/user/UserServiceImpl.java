package com.todolist.backend.service.user;

import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.dto.SignUpDTO;
import com.todolist.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

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
        /*
        if (idDupCheck(dto.getLoginId()) || emailDupCheck(dto.getEmail()) || nicknameDupCheck(dto.getNickname())) {
            return false; // 중복이 있으면 false -> 회원가입 불가능
        }
        */
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

                UserEntity saved = userRepository.save(user);
                return "complete";
            }catch (Exception e){
                return "server error";
            }

        }
    }
}
