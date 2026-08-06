package com.bwabhalabtkar.backend.features.user.service;

import com.bwabhalabtkar.backend.features.auth.dto.request.SignupRequest;
import com.bwabhalabtkar.backend.features.user.dto.request.AdminCreateRequest;
import com.bwabhalabtkar.backend.features.user.dto.request.CustomerUpdateRequest;
import com.bwabhalabtkar.backend.features.user.dto.response.AdminResponse;
import com.bwabhalabtkar.backend.features.user.dto.response.CustomerResponse;
import com.bwabhalabtkar.backend.features.user.entity.User;
import com.bwabhalabtkar.backend.features.user.repository.UserRepository;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    @Autowired
    private UserRepository userRepository;

    public List<AdminResponse> getAllAdmins()
    {
        return userRepository.findAll().stream()
                // Filter to only include users with admin roles
                .filter(user -> user.getRoles().contains("ROLE_ADMIN") || user.getRoles().contains("ROLE_SUPER_ADMIN"))
                .map(user -> new AdminResponse(user.getId(), user.getName(), user.getEmail(), user.getRoles(), user.isEnabled()))
                .collect(Collectors.toList());
    }

    public AdminResponse createAdminUser(AdminCreateRequest request)
    {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(request.getRoles());
        user.setEnabled(true); // Active immediately

        User savedUser = userRepository.save(user);
        return new AdminResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRoles(), savedUser.isEnabled());
    }


    public AdminResponse updateAdminUser(int id , AdminCreateRequest request)
    {

        User user  = userRepository.findById(Long.valueOf(id)).orElseThrow(() -> new RuntimeException("Admin account not found."));
        user.setName(request.getName());
        user.setRoles(request.getRoles());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        User updatedUser = userRepository.save(user);
        return new AdminResponse(updatedUser.getId(), updatedUser.getName(),
                updatedUser.getEmail(), updatedUser.getRoles(), updatedUser.isEnabled());
    }


    public void deactivateAdminUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin account not found."));
        user.setEnabled(false);
        userRepository.save(user);
    }



    public User createUser(SignupRequest request) {
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        Set<String> roles = new java.util.HashSet<>();
        roles.add("ROLE_CUSTOMER");

        user.setRoles(roles);
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public List<CustomerResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRoles().contains("ROLE_CUSTOMER"))
                .map(user -> new CustomerResponse(
                         user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.isEnabled()))
                .toList();
    }

    public CustomerResponse updateUser(Long id, CustomerUpdateRequest request) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(request.getName());
        existingUser.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(existingUser);

        return new CustomerResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.isEnabled()
        );
    }

    public void deactivateUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(false);

        userRepository.save(user);
    }


    public void reactivateUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);

        userRepository.save(user);
    }

}
