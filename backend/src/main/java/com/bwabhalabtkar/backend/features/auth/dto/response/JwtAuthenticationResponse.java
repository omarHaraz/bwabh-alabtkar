package com.bwabhalabtkar.backend.features.auth.dto.response;


public class JwtAuthenticationResponse
{
    private String token;

    // Constructor
    public JwtAuthenticationResponse(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
