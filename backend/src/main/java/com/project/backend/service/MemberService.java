package com.project.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.project.backend.dto.MemberResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public Member registerMember(String id, String pw, String name, String phone, String email,
                                 String business, String addr, String detailAddr) {
        Member member = new Member();
        member.setId(id);
        member.setPw(passwordEncoder.encode(pw));
        member.setName(name);
        member.setPhone(phone);
        member.setEmail(email);
        member.setBusiness(business);
        member.setAddr(addr);
        member.setDetailAddr(detailAddr);
        return memberRepository.save(member);
    }

    public boolean checkDuplicateId(String id) {
        return memberRepository.findMemberById(id) != null;
    }

    @Transactional
    public void updateMember(int no, Member updatedMember) {
        memberRepository.updateMember(
                no,
                updatedMember.getName(),
                updatedMember.getPhone(),
                updatedMember.getAddr(),
                updatedMember.getDetailAddr()
        );
    }

    public void deleteMember(int no) {
        Member member = memberRepository.findByNo(no);
        if (member == null) {
            throw new IllegalArgumentException("Invalid member No: " + no);
        }
        memberRepository.delete(member);
    }

    public Map<String, Object> getMemberWithPagination(int page, int size, String f, String q) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "regDate"));

        Page<Member> memberPage;

        if ((f != null && q != null && !q.isEmpty())) {
            memberPage = memberRepository.findByField(f, q, pageable);
        } else {
            memberPage = memberRepository.findAll(pageable);
        }

        List<MemberResponse> memberResponse = memberPage.getContent()
                .stream()
                .map(member -> new MemberResponse(
                        member.getNo(),
                        member.getId(),
                        member.getName(),
                        member.getPhone(),
                        member.getAddr(),
                        member.getRegDate()
                ))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("members", memberResponse);
        response.put("totalCount", memberPage.getTotalElements());
        response.put("totalPages", memberPage.getTotalPages());

        return response;
    }

    public MemberResponse getMember(int no) {
        Member member = memberRepository.findByNo(no);
        if (member == null) {
            throw new IllegalArgumentException("Invalid member No: " + no);
        }
        return new MemberResponse(
                member.getNo(),
                member.getId(),
                member.getName(),
                member.getPhone(),
                member.getEmail(),
                member.getBusiness(),
                member.getAddr(),
                member.getDetailAddr(),
                member.getRegDate());
    }
}
