package com.bwabhalabtkar.backend.user.dto;

public class CustomerResponse {

    private int id;
    private String name;
    private String email;
    private boolean enabled;

    public CustomerResponse(int id, String name, String email, boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.enabled = enabled;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public boolean isEnabled() {
        return enabled;
    }
}