package com.project.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

        @Modifying
        @Transactional
        @Query("UPDATE Member m SET " +
                        "m.name = COALESCE(:name, m.name), " +
                        "m.phone = COALESCE(:phone, m.phone), " +
                        "m.addr = COALESCE(:addr, m.addr), " +
                        "m.detailAddr = COALESCE(:detailAddr, m.detailAddr) " +
                        "WHERE m.no = :no")
        int updateMember(
                        int no,
                        String name,
                        String phone,
                        String addr,
                        String detailAddr);
}
