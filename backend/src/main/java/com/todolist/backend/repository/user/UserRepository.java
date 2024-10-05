package com.todolist.backend.repository.user;

import com.todolist.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository
        extends JpaRepository<UserEntity,Long> {


    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);
    boolean existsByLoginIdOrEmailOrNickname(String loginId, String email, String nickname);

    UserEntity findByLoginId(String loginId);

}
