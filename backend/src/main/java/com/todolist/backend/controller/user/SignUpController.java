package com.todolist.backend.controller.user;

import com.todolist.backend.dto.SignUpDTO;
import com.todolist.backend.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sign-up")
@RequiredArgsConstructor
public class SignUpController {

    private final UserService userService;

    @PostMapping("/id-check")
    public String idCheck(@RequestBody SignUpDTO dto) {
        boolean idDup = userService.idDupCheck(dto.getLoginId());
        if(idDup){
            return "disable";
        }else{
            return "able";
        }
    }
    @PostMapping("/email-check")
    public String emailCheck(@RequestBody SignUpDTO dto) {
        boolean emailDup = userService.emailDupCheck(dto.getEmail());
        if(emailDup){
            return "disable";
        }else{
            return "able";
        }
    }
    @PostMapping("/nickname-check")
    public String nicknameCheck(@RequestBody SignUpDTO dto) {
        boolean idDup = userService.nicknameDupCheck(dto.getNickname());
        if(idDup){
            return "disable";
        }else{
            return "able";
        }
    }

}
