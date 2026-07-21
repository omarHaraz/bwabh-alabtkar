package com.bwabhalabtkar.backend.settings.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class StoreSettingsRequest {

    @NotBlank(message = "Store name cannot be blank")
    private String storeName;

    @NotBlank(message = "Support email cannot be blank")
    @Email(message = "Please provide a valid support email address")
    private String supportEmail;

    // Getters and Setters
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getSupportEmail() { return supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }

}
