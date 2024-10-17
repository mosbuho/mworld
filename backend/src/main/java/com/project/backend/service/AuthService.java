package com.project.backend.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.backend.entity.Admin;
import com.project.backend.entity.Member;
import com.project.backend.repository.AdminRepository;
import com.project.backend.repository.MemberRepository;

@Service
public class AuthService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private JavaMailSender mailSender;

    private final MemberRepository memberRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(MemberRepository memberRepository, AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {
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

    public void sendVerificationEmail(String to, String verificationCode) {
        redisTemplate.opsForValue().set(to, verificationCode, 5, TimeUnit.MINUTES);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("이메일 인증");
        message.setText("인증번호 : " + verificationCode);
        mailSender.send(message);
    }

    public String getVerificationCode(String email) {
        return redisTemplate.opsForValue().get(email);
    }
}
