package com.todolist.backend.oauth;

import com.todolist.backend.domain.UserEntity;
import com.todolist.backend.oauth.response.GoogleResponse;
import com.todolist.backend.oauth.response.NaverResponse;
import com.todolist.backend.oauth.response.OAuth2Response;
import com.todolist.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("오긴 하니?");
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;
        if(registrationId.equals("naver")){
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        }else if(registrationId.equals("google")){
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }else{
            return null;
        }

        //userName으로 쓸 거
        String snsId = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();
        System.out.println(snsId);
        UserEntity findUser = userRepository.findBySnsId(snsId);
        String role = "ROLE_USER";

        if(findUser == null){
            UserEntity newUser = UserEntity.builder()
                    .loginId("sns")
                    .password("sns")
                    .nickname(oAuth2Response.getEmail().split("@")[0])
                    .email(oAuth2Response.getEmail())
                    .snsId(snsId)
                    .role("ROLE_USER")
                    .build();
            userRepository.save(newUser);
        }

        return new CustomOAuth2User(oAuth2Response,role);
    }
}
