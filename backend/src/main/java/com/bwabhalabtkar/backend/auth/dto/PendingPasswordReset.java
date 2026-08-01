package com.bwabhalabtkar.backend.auth.dto;

public class PendingPasswordReset {

    private String email;
    private String otp;

    public PendingPasswordReset() {
    }

    public PendingPasswordReset(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}