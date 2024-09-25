package com.todolist.backend.repository.user;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserQueryDSLImpl implements UserQueryDSL{

    private final JPAQueryFactory queryFactory;


}
