package com.bwabhalabtkar.backend.user.dto;

import java.util.Set;

public class AdminCreateRequest {
    private String name;
    private String email;
    private String password;
    private Set<String> roles; // e.g., ["ROLE_ADMIN"]

    // Constructors
    public AdminCreateRequest() {}

    public AdminCreateRequest(String name, String email, String password, Set<String> roles) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}