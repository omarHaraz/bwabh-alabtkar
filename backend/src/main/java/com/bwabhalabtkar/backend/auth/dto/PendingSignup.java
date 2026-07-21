package com.bwabhalabtkar.backend.auth.dto;

public class PendingSignup {

    private String name;
    private String email;
    private String password;
    private String otp;

    public PendingSignup() {
    }

    public PendingSignup(String name, String email, String password, String otp) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.otp = otp;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getOtp() {
        return otp;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}