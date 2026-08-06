package com.bwabhalabtkar.backend.features.user.controller;

import com.bwabhalabtkar.backend.features.user.dto.request.CustomerUpdateRequest;
import com.bwabhalabtkar.backend.features.user.dto.response.CustomerResponse;
import com.bwabhalabtkar.backend.features.user.service.UserService;



import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/management")
@PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_ADMIN')")
public class CustomerManagementController
{

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getCustomers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest request) {



        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @PatchMapping("/{id}/reactivate")
    public ResponseEntity<Void> reactivateCustomer(@PathVariable Long id) {

        userService.reactivateUser(id);

        return ResponseEntity.noContent().build();
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateCustomer(@PathVariable Long id) {

        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }





}
