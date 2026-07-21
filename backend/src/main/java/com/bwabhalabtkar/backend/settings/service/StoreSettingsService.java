package com.bwabhalabtkar.backend.settings.service;

import com.bwabhalabtkar.backend.settings.dto.StoreSettingsRequest;
import com.bwabhalabtkar.backend.settings.dto.StoreSettingsResponse;
import com.bwabhalabtkar.backend.settings.model.StoreSettings;
import com.bwabhalabtkar.backend.settings.repository.StoreSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreSettingsService {

    @Autowired
    private StoreSettingsRepository settingsRepository;

    public StoreSettingsResponse getStoreSettings() {
        StoreSettings settings = settingsRepository.getSettings();
        return new StoreSettingsResponse(settings.getStoreName(), settings.getSupportEmail());
    }

    @Transactional
    public StoreSettingsResponse updateStoreSettings(StoreSettingsRequest request) {
        StoreSettings settings = settingsRepository.getSettings();

        settings.setStoreName(request.getStoreName().trim());
        settings.setSupportEmail(request.getSupportEmail().trim());

        StoreSettings updatedSettings = settingsRepository.save(settings);
        return new StoreSettingsResponse(updatedSettings.getStoreName(), updatedSettings.getSupportEmail());
    }
}