package com.bwabhalabtkar.backend.settings.dto;

public class StoreSettingsResponse {
    private String storeName;
    private String supportEmail;

    public StoreSettingsResponse(String storeName, String supportEmail) {
        this.storeName = storeName;
        this.supportEmail = supportEmail;
    }

    // Getters and Setters
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getSupportEmail() { return supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }
}