package com.project.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.dto.AuthResponse;
import com.project.backend.dto.LoginRequest;
import com.project.backend.entity.Admin;
import com.project.backend.entity.Member;
import com.project.backend.service.AuthService;
import com.project.backend.service.JwtService;
import com.project.backend.service.MemberService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtUtil;
    private final AuthService authService;
    private final MemberService memberService;

    public AuthController(JwtService jwtUtil, AuthService authService, MemberService memberService) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.memberService = memberService;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (jwtUtil.validateRefreshToken(refreshToken)) {
            String username = jwtUtil.getUsernameFromRefreshToken(refreshToken);
            String role = jwtUtil.getRoleFromRefreshToken(refreshToken);
            int no = jwtUtil.getNoFromRefreshToken(refreshToken);
            String newAccessToken = jwtUtil.generateAccessToken(username, role, no);
            return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshToken, no));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMember(@RequestBody LoginRequest loginRequest) {
        Member member = authService.authenticateMember(loginRequest.getId(), loginRequest.getPw());
        if (member != null) {
            String accessToken = jwtUtil.generateAccessToken(member.getId(), "ROLE_MEMBER", member.getNo());
            String refreshToken = jwtUtil.generateRefreshToken(member.getId(), "ROLE_MEMBER", member.getNo());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, member.getNo()));
        } else {
            return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(@RequestBody Member member) {
        try {
            memberService.registerMember(member.getId(), member.getPw(),
                    member.getName(), member.getPhone(), member.getAddr());
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest loginRequest) {
        Admin admin = authService.authenticateAdmin(loginRequest.getId(), loginRequest.getPw());
        if (admin != null) {
            String accessToken = jwtUtil.generateAccessToken(admin.getId(), "ROLE_ADMIN", admin.getNo());
            String refreshToken = jwtUtil.generateRefreshToken(admin.getId(), "ROLE_ADMIN", admin.getNo());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, admin.getNo()));
        } else {
            return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    @PostMapping("/social/login")
    public ResponseEntity<?> socialLogin(@RequestBody Map<String, String> request) {
        String provider = request.get("provider");
        String code = request.get("code");
        try {
            Map<String, Object> userInfo = authService.getSocialUserInfo(provider, code);
            Member member = authService.socialLoginOrRegister(provider, userInfo);
            String accessToken = jwtUtil.generateAccessToken(member.getId(), "ROLE_MEMBER", member.getNo());
            String refreshToken = jwtUtil.generateRefreshToken(member.getId(), "ROLE_MEMBER", member.getNo());
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, member.getNo()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("소셜 로그인 실패: " + e.getMessage());
        }
    }
}
