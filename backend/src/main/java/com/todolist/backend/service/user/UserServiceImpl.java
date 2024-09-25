package com.todolist.backend.service.user;

import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    @Override
    public boolean idDupCheck(String loginId) {
        UserEntity user = userRepository.findByLoginId(loginId);
        if(user == null){
            return false;
        }else{
            return true;
        }
    }

    @Override
    public boolean emailDupCheck(String email) {
        UserEntity user = userRepository.findByEmail(email);
        if(user == null){
            return false;
        }else{
            return true;
        }
    }

    @Override
    public boolean nicknameDupCheck(String nickname) {
        UserEntity user = userRepository.findByNickname(nickname);
        if(user == null){
            return false;
        }else{
            return true;
        }
    }
}
