package com.bwabhalabtkar.backend.auth.service;

import com.bwabhalabtkar.backend.auth.dto.PendingPasswordReset;
import com.bwabhalabtkar.backend.auth.dto.PendingSignup;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class OtpService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ==========================================
    // Signup OTP
    // ==========================================

    public void savePendingSignup(PendingSignup signup)
            throws JsonProcessingException {

        String json = objectMapper.writeValueAsString(signup);

        redisTemplate.opsForValue().set(
                "signup:" + signup.getEmail(),
                json,
                Duration.ofMinutes(5)
        );
    }

    public PendingSignup getPendingSignup(String email)
            throws JsonProcessingException {

        String json = redisTemplate.opsForValue()
                .get("signup:" + email);

        if (json == null) {
            return null;
        }

        return objectMapper.readValue(
                json,
                PendingSignup.class
        );
    }

    public void deletePendingSignup(String email) {

        redisTemplate.delete("signup:" + email);

    }

    // ==========================================
    // Password Reset OTP
    // ==========================================

    public void savePendingPasswordReset(PendingPasswordReset reset)
            throws JsonProcessingException {

        String json = objectMapper.writeValueAsString(reset);

        redisTemplate.opsForValue().set(
                "reset:" + reset.getEmail(),
                json,
                Duration.ofMinutes(5)
        );
    }

    public PendingPasswordReset getPendingPasswordReset(String email)
            throws JsonProcessingException {

        String json = redisTemplate.opsForValue()
                .get("reset:" + email);

        if (json == null) {
            return null;
        }

        return objectMapper.readValue(
                json,
                PendingPasswordReset.class
        );
    }

    public void deletePendingPasswordReset(String email) {

        redisTemplate.delete("reset:" + email);

    }

}