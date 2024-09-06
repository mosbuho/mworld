package com.project.backend.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.backend.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Integer> {
        Member findMemberById(String id);

        Member findByNo(int no);

        @Query("SELECT m FROM Member m WHERE " +
                        "((:f = 'ID' AND m.id LIKE %:q%) OR " +
                        "(:f = 'NAME' AND m.name LIKE %:q%) OR " +
                        "(:f = 'PHONE' AND m.phone LIKE %:q%) OR " +
                        "(:q IS NULL OR :q = '')) AND " +
                        "((:startDate IS NULL OR m.regDate >= :startDate) AND " +
                        "(:endDate IS NULL OR m.regDate <= :endDate))")
        Page<Member> findByField(
                        @Param("f") String f,
                        @Param("q") String q,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate,
                        Pageable pageable);

        Member findByProviderAndProviderId(String provider, String providerId);
}
