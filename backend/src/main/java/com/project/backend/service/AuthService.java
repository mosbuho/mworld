package com.project.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.backend.entity.Admin;
import com.project.backend.entity.Member;
import com.project.backend.repository.AdminRepository;
import com.project.backend.repository.MemberRepository;

@Service
public class AuthService {
    private final MemberRepository memberRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(MemberRepository memberRepository, AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Member authenticateMember(String id, String pw) {
        Member member = memberRepository.findMemberById(id);
        if (member != null && passwordEncoder.matches(pw, member.getPw())) {
            return member;
        }
        return null;
    }

    public Admin authenticateAdmin(String id, String pw) {
        Admin admin = adminRepository.findAdminById(id);
        if (admin != null && passwordEncoder.matches(pw, admin.getPw())) {
            return admin;
        }
        return null;
    }
    
}
