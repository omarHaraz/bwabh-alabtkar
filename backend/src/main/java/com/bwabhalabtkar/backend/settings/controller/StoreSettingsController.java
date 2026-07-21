package com.bwabhalabtkar.backend.settings.controller;

import com.bwabhalabtkar.backend.settings.dto.StoreSettingsRequest;
import com.bwabhalabtkar.backend.settings.dto.StoreSettingsResponse;
import com.bwabhalabtkar.backend.settings.service.StoreSettingsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
public class StoreSettingsController {

    @Autowired
    private StoreSettingsService settingsService;

    @GetMapping
    public ResponseEntity<StoreSettingsResponse> getSettings() {
        return ResponseEntity.ok(settingsService.getStoreSettings());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN')")
    @PutMapping
    public ResponseEntity<StoreSettingsResponse> updateSettings(
            @Valid @RequestBody StoreSettingsRequest request) {
        return ResponseEntity.ok(settingsService.updateStoreSettings(request));
    }
}