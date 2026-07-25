package com.bwabhalabtkar.backend.auth.controller;

import com.bwabhalabtkar.backend.auth.dto.*;
import com.bwabhalabtkar.backend.user.dto.CustomerResponse;
import com.bwabhalabtkar.backend.user.model.User;
import com.bwabhalabtkar.backend.user.repository.UserRepository;
import com.bwabhalabtkar.backend.auth.security.JwtTokenProvider;
import com.bwabhalabtkar.backend.auth.service.EmailService;
import com.bwabhalabtkar.backend.auth.service.OtpService;
import com.bwabhalabtkar.backend.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow();

        String jwt = tokenProvider.generateToken(
                user.getEmail(),
                user.getRoles()
        );
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("An account with this email already exists.");
        }

        try {

            String code = String.format("%06d",
                    new SecureRandom().nextInt(1_000_000));

            // Store the hashed password in Redis
            PendingSignup signup = new PendingSignup(
                    request.getName(),
                    request.getEmail(),
                    passwordEncoder.encode(request.getPassword()),
                    code
            );

            otpService.savePendingSignup(signup);

            emailService.sendHtmlEmail(
                    request.getEmail(),
                    "Your StyleSphere Verification Code",
                    code
            );

            return ResponseEntity.ok("Verification code sent.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody OtpVerificationRequest request) {

        try {

            PendingSignup signup = otpService.getPendingSignup(request.getEmail());

            if (signup == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("OTP expired.");
            }

            if (!signup.getOtp().equals(request.getCode())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid OTP.");
            }

            if (userRepository.existsByEmail(signup.getEmail())) {

                otpService.deletePendingSignup(signup.getEmail());

                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("An account with this email already exists.");
            }

            userService.createUser(
                    new SignupRequest(
                            signup.getName(),
                            signup.getEmail(),
                            signup.getPassword()

                            // already hashed
                    )
            );

            emailService.sendWelcomeEmail(
                    signup.getEmail(),
                    signup.getName()
            );

            otpService.deletePendingSignup(signup.getEmail());

            User user = userRepository.findByEmail(signup.getEmail())
                    .orElseThrow();

            String jwt = tokenProvider.generateToken(
                    user.getEmail(),
                    user.getRoles()
            );

            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Verification failed: " + e.getMessage());
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody ResendOtpRequest request) {

        try {

            PendingSignup signup = otpService.getPendingSignup(request.getEmail());

            if (signup == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Signup session expired. Please register again.");
            }

            String newOtp = String.format("%06d",
                    new SecureRandom().nextInt(1_000_000));

            signup.setOtp(newOtp);

            // Save again (updates Redis and resets expiration)
            otpService.savePendingSignup(signup);

            emailService.sendHtmlEmail(
                    signup.getEmail(),
                    "Your StyleSphere Verification Code",
                    newOtp
            );

            return ResponseEntity.ok("OTP resent successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to resend OTP.");
        }
    }




    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        System.out.println(authentication);


        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow();

        return ResponseEntity.ok(
                new CurrentUserResponse(
                        (long)user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRoles()
                )
        );
    }
}