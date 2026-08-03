package com.bwabhalabtkar.backend.auth.controller;

import com.bwabhalabtkar.backend.auth.dto.*;
import com.bwabhalabtkar.backend.user.dto.CustomerResponse;
import com.bwabhalabtkar.backend.user.model.User;
import com.bwabhalabtkar.backend.user.repository.UserRepository;
import com.bwabhalabtkar.backend.auth.security.JwtTokenProvider;
import com.bwabhalabtkar.backend.auth.service.EmailService;
import com.bwabhalabtkar.backend.auth.service.OtpService;
import com.bwabhalabtkar.backend.user.service.UserService;
import jakarta.validation.Valid;
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
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {

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
    public ResponseEntity<?> requestOtp(@Valid @RequestBody SignupRequest request) {

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
                    "Your Bwabh Alabtkar Verification Code",
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
            @Valid @RequestBody OtpVerificationRequest request) {

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
    public ResponseEntity<?> resendOtp(@Valid @RequestBody ResendOtpRequest request) {

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
                    "Your Bwabh Alabtkar Verification Code",
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


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        try {

            User user = userRepository
                    .findByEmail(request.getEmail())
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No account found with this email.");
            }

            String code = String.format(
                    "%06d",
                    new SecureRandom().nextInt(1_000_000)
            );

            PendingPasswordReset reset =
                    new PendingPasswordReset(
                            request.getEmail(),
                            code
                    );

            otpService.savePendingPasswordReset(reset);

            System.out.println("Forgot password for: " + request.getEmail());

            emailService.sendHtmlEmail(
                    request.getEmail(),
                    "Your Bwabh Alabtkar Password Reset Code",
                    code
            );

            System.out.println("Email sent successfully.");

            return ResponseEntity.ok(
                    "Verification code sent."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send verification code.");

        }
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(
            @Valid @RequestBody ResetPasswordVerificationRequest request) {

        try {

            PendingPasswordReset reset =
                    otpService.getPendingPasswordReset(request.getEmail());

            if (reset == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Verification code expired.");

            }

            if (!reset.getOtp().equals(request.getCode())) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid verification code.");

            }

            return ResponseEntity.ok("Verification successful.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Verification failed.");

        }

    }


    @PostMapping("/resend-reset-code")
    public ResponseEntity<?> resendResetCode(
            @Valid @RequestBody ForgotPasswordRequest request) {

        try {

            PendingPasswordReset reset =
                    otpService.getPendingPasswordReset(request.getEmail());

            if (reset == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Password reset session expired.");

            }

            String newOtp = String.format(
                    "%06d",
                    new SecureRandom().nextInt(1_000_000)
            );

            reset.setOtp(newOtp);

            otpService.savePendingPasswordReset(reset);

            emailService.sendHtmlEmail(
                    reset.getEmail(),
                    "Your Bwabh Alabtkar Password Reset Code",
                    newOtp
            );

            return ResponseEntity.ok(
                    "Verification code resent."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to resend verification code.");

        }

    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        try {

            PendingPasswordReset reset =
                    otpService.getPendingPasswordReset(request.getEmail());

            if (reset == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Password reset session expired.");
            }

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found."));

            user.setPassword(passwordEncoder.encode(request.getPassword()));

            userRepository.save(user);

            otpService.deletePendingPasswordReset(request.getEmail());

            return ResponseEntity.ok("Password reset successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to reset password.");
        }
    }


}