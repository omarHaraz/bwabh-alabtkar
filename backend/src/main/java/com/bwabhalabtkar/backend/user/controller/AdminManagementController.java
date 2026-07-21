package com.bwabhalabtkar.backend.user.controller;


import com.bwabhalabtkar.backend.user.dto.AdminCreateRequest;
import com.bwabhalabtkar.backend.user.dto.AdminResponse;
import com.bwabhalabtkar.backend.user.service.UserService;
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
    public ResponseEntity<?> addAdmin(@RequestBody AdminCreateRequest request)
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
    public ResponseEntity<?> updateAdmin(@PathVariable int id, @RequestBody AdminCreateRequest request) {
        try {
            AdminResponse response = userService.updateAdminUser(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAdmin(@PathVariable Long id) {
        userService.deactivateAdminUser(id);
        return ResponseEntity.noContent().build();
    }
}
