package com.bwabhalabtkar.backend.user.dto;

import java.util.Set;

public class AdminResponse {
    private int id;
    private String name;
    private String email;
    private Set<String> roles;
    private boolean enabled;

    public AdminResponse(int id, String name, String email, Set<String> roles, boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.enabled = enabled;
    }

    // Getters and Setters
    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Set<String> getRoles() { return roles; }
    public boolean isEnabled() { return enabled; }
}