package com.project.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.backend.entity.Member;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Member findMemberById(String id);

    @Query("SELECT m FROM Member m WHERE " +
            "(:f = 'ID' AND m.id LIKE %:q%) OR " +
            "(:f = 'NAME' AND m.name LIKE %:q%) OR " +
            "(:f = 'PHONE' AND m.phone LIKE %:q%) " +
            "AND (:startDate IS NULL OR m.regDate >= :startDate) " +
            "AND (:endDate IS NULL OR m.regDate <= :endDate)")
    Page<Member> findByField(
            @Param("f") String f,
            @Param("q") String q,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

}