package com.project.backend.service;

import com.project.backend.entity.Member;
import com.project.backend.repository.MemberRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MemberService {

    private MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @PersistenceContext
    private EntityManager entityManager;

    public List<Member> getMemberList(int page, int size) {
        int pageSize = size - page + 1;

        Query query = entityManager.createQuery("SELECT m FROM Member m ORDER BY m.regDate DESC", Member.class);

        query.setFirstResult(page - 1);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }

    public Member updateMember(int no, Member updatedMember) {
        Member member = memberRepository.findByNo(no);
        if (member == null) {
            throw new IllegalArgumentException("Invalid member No: " + no);
        }

        // 필요한 필드 업데이트
        member.setName(updatedMember.getName());
        member.setPhone(updatedMember.getPhone());
        member.setAddr(updatedMember.getAddr());

        return memberRepository.save(member); // 수정 후 저장
    }

    // 회원 삭제 로직
    public void deleteMember(int no) {
        Member member = memberRepository.findByNo(no);
        if (member == null) {
            throw new IllegalArgumentException("Invalid member No: " + no);
        }
        System.out.println(member);
        memberRepository.delete(member);
    }


    public Map<String, Object> getMemberWithPagination(int page, int size, String f, String q, LocalDate startDate, LocalDate endDate) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "regDate"));

        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;
        Page<Member> memberPage;

        if ((f != null && q != null && !q.isEmpty()) || (startDateTime != null && endDateTime != null)) {
            memberPage = memberRepository.findByField(f, q, startDateTime, endDateTime, pageable);
        } else {
            memberPage = memberRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("members", memberPage.getContent());
        response.put("totalCount", memberPage.getTotalElements());
        response.put("totalPages", memberPage.getTotalPages());

        return response;
    }

}
