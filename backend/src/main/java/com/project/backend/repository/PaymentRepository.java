package com.project.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.backend.entity.Payment;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p.transactionId, p.method, SUM(p.price), MAX(p.regDate), p.status, m.name, m.phone " +
            "FROM Payment p " +
            "JOIN p.member m " +
            "GROUP BY p.transactionId, p.method, p.status, m.name, m.phone " +
            "ORDER BY MAX(p.regDate) DESC")
    Page<Object[]> findGroupedPayments(Pageable pageable);
}
