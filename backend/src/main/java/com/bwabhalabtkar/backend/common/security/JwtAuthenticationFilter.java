package com.bwabhalabtkar.backend.common.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter  extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // This tells Spring to completely bypass this filter for auth endpoints
        String path = request.getServletPath();


        return path.equals("/api/auth/login")
                || path.equals("/api/auth/request-otp")
                || path.equals("/api/auth/verify-otp")
                || path.equals("/api/auth/resend-otp")
                || path.equals("/api/auth/forgot-password")
                || path.equals("/api/auth/verify-reset-code")
                || path.equals("/api/auth/resend-reset-code")
                || path.equals("/api/auth/reset-password");
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (tokenProvider.validateToken(token)) {
                String username =
                        tokenProvider.getUsernameFromJWT(token);


                List<String> roles = tokenProvider.getRolesFromJWT(token);

                List<SimpleGrantedAuthority> authorities =
                        roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .toList();

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(username,null, authorities);

                auth.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));


                SecurityContextHolder.getContext()
                        .setAuthentication(auth);
            }

        }
        filterChain.doFilter(request, response);

    }
}
