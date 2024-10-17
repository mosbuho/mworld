package com.project.backend.repository;

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
                        "(:q IS NULL OR :q = ''))")
        Page<Member> findByField(
                        @Param("f") String f,
                        @Param("q") String q,
                        Pageable pageable);

        Member findByProviderAndProviderId(String provider, String providerId);
}
