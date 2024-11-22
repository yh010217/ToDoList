package com.todolist.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfigCors implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000"
                        , "http://localhost"
                        , "http://frontend"
                        , "http://43.202.103.152"
                        , "http://wooli-st.online"
                        , "https://wooli-st.online"
                        , "http://wooli-st.online/**"
                        , "https://wooli-st.online/**"
                        , "http://43.202.103.152"
                        , "https://43.202.103.152")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);


    }
}
