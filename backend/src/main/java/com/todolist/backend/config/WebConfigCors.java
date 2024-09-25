package com.todolist.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfigCors implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedOrigins("http://localhost")
                .allowedMethods("GET","POST","PUT","DELETE")
                .allowCredentials(true);

        registry.addMapping("/api/sign-up/id-check")
                .allowedOrigins("http://localhost:3000")
                .allowedOrigins("http://localhost")
                .allowedMethods("GET","POST","PUT","DELETE")
                .allowCredentials(true);

    }
}
