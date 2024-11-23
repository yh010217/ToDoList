package com.todolist.backend.config;

import com.todolist.backend.config.jwt.CustomLogoutFilter;
import com.todolist.backend.config.jwt.JWTFilter;
import com.todolist.backend.config.jwt.JWTUtil;
import com.todolist.backend.config.jwt.LoginFilter;
import com.todolist.backend.repository.user.RefreshRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;

    private final RefreshRepository refreshRepository;

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable);

        http
                .formLogin((auth) -> auth.disable());

//        http
//                .oauth2Login((oauth2) ->
//                        oauth2.loginPage("/"));

        http
                .httpBasic((auth) -> auth.disable());


        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/","/api/login/reissue","/api/**").permitAll()
                )//일단 /api/** 는 임시로..
        ;

        http
                .sessionManagement((session) ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                .addFilterBefore(new JWTFilter(jwtUtil),LoginFilter.class);

        http
                .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration)
                                ,jwtUtil,refreshRepository)
                        , UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterBefore(new CustomLogoutFilter(jwtUtil,refreshRepository)
                        , LogoutFilter.class);


        return http.build();
    }

}
