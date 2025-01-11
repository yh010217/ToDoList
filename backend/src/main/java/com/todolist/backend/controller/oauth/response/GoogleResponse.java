package com.todolist.backend.controller.oauth.response;

import java.util.Map;

public class GoogleResponse implements OAuth2Response{
    private final Map<String,Object> attribute;

    public GoogleResponse(Map<String, Object> attribute) {
        //구글은 그냥 일차원적으로 옴
        this.attribute = attribute;
    }

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getProviderId() {
        return attribute.get("sub").toString();
    }

    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }
}
