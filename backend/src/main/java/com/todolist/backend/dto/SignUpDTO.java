package com.todolist.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignUpDTO {
    private String loginId;
    private String password;
    private String email;
    private String nickname;
}
