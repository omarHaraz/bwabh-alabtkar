package com.bwabhalabtkar.backend.features.user.controller;

import com.bwabhalabtkar.backend.features.user.dto.request.AdminCreateRequest;
import com.bwabhalabtkar.backend.features.user.dto.response.AdminResponse;
import com.bwabhalabtkar.backend.features.user.service.UserService;



import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/management")
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
public class AdminManagementController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<AdminResponse>> listAdmins()
    {
        return ResponseEntity.ok(userService.getAllAdmins());
    }

    @PostMapping
    public ResponseEntity<?> addAdmin(@Valid @RequestBody AdminCreateRequest request)
    {
        try {
            AdminResponse response = userService.createAdminUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable int id, @Valid @RequestBody AdminCreateRequest request) {
        try {
            AdminResponse response = userService.updateAdminUser(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/reactivate")
    public ResponseEntity<Void> reactivateAdmin(@PathVariable Long id) {

        userService.reactivateUser(id);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAdmin(@PathVariable Long id) {
        userService.deactivateAdminUser(id);
        return ResponseEntity.noContent().build();
    }
}
