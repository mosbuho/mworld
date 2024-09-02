package com.project.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.service.AuthService;
import com.project.backend.service.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final JwtService jwtUtil;
    private final AuthService authService;

    public AuthController(JwtService jwtUtil, AuthService authService) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }
}
