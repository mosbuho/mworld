package com.project.backend.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.backend.entity.Member;
import com.project.backend.repository.MemberRepository;

@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Member registerMember(String id, String pw, String name, String phone, String addr) {
        try {
            Member member = new Member();
            member.setId(id);
            member.setPw(passwordEncoder.encode(pw));
            member.setName(name);
            member.setPhone(phone);
            member.setAddr(addr);

            return memberRepository.save(member);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("이미 존재하는 ID 또는 이메일입니다.", e);
        } 
    }
}
