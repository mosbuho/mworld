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

    public Map<String, Object> getMemberWithPagination(int page, int size, String f, String q, LocalDate startDate, LocalDate endDate) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "regDate"));

        Page<Member> memberPage;

        if ((f != null && q != null && !q.isEmpty()) || (startDate != null && endDate != null)) {
            memberPage = memberRepository.findByField(f, q, startDate, endDate, pageable);
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
