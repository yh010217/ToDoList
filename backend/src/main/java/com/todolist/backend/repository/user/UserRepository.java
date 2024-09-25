package com.todolist.backend.repository.user;

import com.todolist.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository
        extends JpaRepository<UserEntity,Long>,UserQueryDSL{
    UserEntity findByLoginId(String id);
    UserEntity findByEmail(String email);
    UserEntity findByNickname(String nickname);
}
