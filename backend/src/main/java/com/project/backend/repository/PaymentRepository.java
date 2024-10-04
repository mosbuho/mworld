package com.project.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.backend.entity.Payment;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p.transactionId, p.method, SUM(p.price), MAX(p.regDate), p.status, m.name, m.phone " +
            "FROM Payment p " +
            "JOIN p.member m " +
            "GROUP BY p.transactionId, p.method, p.status, m.name, m.phone " +
            "ORDER BY MAX(p.regDate) DESC")
    Page<Object[]> findGroupedPayments(Pageable pageable);

    @Query("SELECT COUNT(DISTINCT p.transactionId), " +
            "SUM(CASE WHEN p.status NOT IN ('CANCELED', 'REFUNDED') THEN p.price ELSE 0 END), " +
            "SUM(CASE WHEN p.status = 'CANCELED' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.status = 'REFUNDED' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.status = 'RETURNED' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.status = 'EXCHANGED' THEN 1 ELSE 0 END) " +
            "FROM Payment p")
    List<Object[]> findTotalAndStatusStatistics();
}
