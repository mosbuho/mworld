package com.project.backend.service;

import com.project.backend.entity.Member;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Member> getMemberList(int page, int size) {
        int pageSize = size - page + 1;

        Query query = entityManager.createQuery("SELECT m FROM Member m ORDER BY m.regDate DESC", Member.class);

        query.setFirstResult(page - 1);
        query.setMaxResults(pageSize);

        return query.getResultList();
    }


}
