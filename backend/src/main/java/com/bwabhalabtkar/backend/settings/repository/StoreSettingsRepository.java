package com.bwabhalabtkar.backend.settings.repository;

import com.bwabhalabtkar.backend.settings.model.StoreSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreSettingsRepository extends JpaRepository<StoreSettings, Long> {
    // Since there's only 1 row of settings for the whole store, we can just grab the top record
    default StoreSettings getSettings() {
        return findAll().stream().findFirst().orElseGet(() -> {
            // Seed a default system config fallback if the table is empty
            StoreSettings defaultSettings = new StoreSettings();
            defaultSettings.setStoreName("Clothify");
            defaultSettings.setSupportEmail("support@clothify.com");
            return save(defaultSettings);
        });
    }
}