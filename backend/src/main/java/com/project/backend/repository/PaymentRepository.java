package com.project.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

        @Query("SELECT p.transactionId, p.method, SUM(p.price), MAX(p.regDate), p.status, m.name, m.phone " +
                        "FROM Payment p " +
                        "JOIN p.member m " +
                        "GROUP BY p.transactionId, p.method, p.status, m.name, m.phone " +
                        "ORDER BY MAX(p.regDate) DESC")
        Page<Object[]> findGroupedPayments(Pageable pageable);

        @Query("SELECT p.transactionId, p.method, SUM(p.price), MAX(p.regDate), p.status, m.name, m.phone " +
                        "FROM Payment p " +
                        "JOIN p.member m " +
                        "WHERE (:f IS NULL OR (CASE WHEN :f = 'MEMBERNAME' THEN m.name " +
                        "                               WHEN :f = 'MEMBERPHONE' THEN m.phone " +
                        "                               WHEN :f = 'TRANSACTIONID' THEN p.transactionId " +
                        "                               ELSE '' END) LIKE %:q%) " +
                        "GROUP BY p.transactionId, p.method, p.status, m.name, m.phone " +
                        "ORDER BY MAX(p.regDate) DESC")
        Page<Object[]> findGroupedPaymentsByField(@Param("f") String f,
                        @Param("q") String q,
                        Pageable pageable);

        @Query("SELECT COUNT(DISTINCT p.transactionId), " +
                        "SUM(CASE WHEN p.status NOT IN ('CANCELED', 'REFUNDED') THEN p.price ELSE 0 END), " +
                        "SUM(CASE WHEN p.status = 'CANCELED' THEN 1 ELSE 0 END), " +
                        "SUM(CASE WHEN p.status = 'REFUNDED' THEN 1 ELSE 0 END), " +
                        "SUM(CASE WHEN p.status = 'RETURNED' THEN 1 ELSE 0 END), " +
                        "SUM(CASE WHEN p.status = 'EXCHANGED' THEN 1 ELSE 0 END) " +
                        "FROM Payment p")
        List<Object[]> findTotalAndStatusStatistics();
}
