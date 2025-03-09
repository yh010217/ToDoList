package com.todolist.backend.config;

import com.todolist.backend.controller.jwt.CustomLogoutFilter;
import com.todolist.backend.controller.jwt.JWTFilter;
import com.todolist.backend.controller.jwt.JWTUtil;
import com.todolist.backend.controller.jwt.LoginFilter;
import com.todolist.backend.controller.oauth.CustomOAuth2SuccessHandler;
import com.todolist.backend.controller.oauth.CustomOAuth2UserService;
import com.todolist.backend.service.user.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final UserService userService;

    private final CustomOAuth2UserService customOAuth2UserService;

    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable);

        http
                .formLogin((auth) -> auth.disable());

        http
                .oauth2Login((oauth2) ->
                            oauth2
                                    .loginPage("/login")
                                    .loginProcessingUrl("/api/login/oauth2/code/*")
                                    .userInfoEndpoint(userInfoEndpointConfig ->
                                    userInfoEndpointConfig.userService(customOAuth2UserService))
                                    .successHandler(customOAuth2SuccessHandler));

        http
                .httpBasic((auth) -> auth.disable());


        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/", "/api/login/reissue"
                                , "/api/**", "/oauth2/authorization/**").permitAll()
                )//일단 /api/** 는 임시로..
        ;

        http
                .sessionManagement((session) ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .addFilterBefore(new JWTFilter(jwtUtil), LoginFilter.class);

        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration)
                                , jwtUtil, userService)
                        , UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterBefore(new CustomLogoutFilter(userService)
                        , LogoutFilter.class);


        return http.build();
    }

}
