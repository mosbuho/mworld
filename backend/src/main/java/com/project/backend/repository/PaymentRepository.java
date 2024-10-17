package com.project.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.backend.entity.Payment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
            "WHERE p.status = :status " +
            "GROUP BY p.transactionId, p.method, p.status, m.name, m.phone " +
            "ORDER BY MAX(p.regDate) DESC")
    Page<Object[]> findGroupedPaymentsByStatus(@Param("status") String status, Pageable pageable);

    @Query("SELECT p.transactionId, p.method, SUM(p.price), MAX(p.regDate), p.status, m.name, m.phone " +
            "FROM Payment p " +
            "JOIN p.member m " +
            "WHERE (:f IS NULL OR (CASE WHEN :f = 'MEMBERNAME' THEN m.name " +
            "                            WHEN :f = 'MEMBERPHONE' THEN m.phone " +
            "                            WHEN :f = 'TRANSACTIONID' THEN p.transactionId " +
            "                            ELSE '' END) LIKE %:q%) " +
            "AND p.status = :status " +
            "GROUP BY p.transactionId, p.method, p.status, m.name, m.phone " +
            "ORDER BY MAX(p.regDate) DESC")
    Page<Object[]> findGroupedPaymentsByFieldAndStatus(@Param("f") String f,
                                                       @Param("q") String q,
                                                       @Param("status") String status,
                                                       Pageable pageable);

    @Query("SELECT COUNT(DISTINCT sub.transactionId) AS totalTransactions, " +
            "SUM(CASE WHEN sub.status NOT IN ('CANCELED', 'REFUNDED') THEN sub.totalPrice ELSE 0 END) AS totalRevenue, " +
            "SUM(CASE WHEN sub.status = 'CANCELED' THEN 1 ELSE 0 END) AS canceledCount, " +
            "SUM(CASE WHEN sub.status = 'REFUNDED' THEN 1 ELSE 0 END) AS refundedCount, " +
            "SUM(CASE WHEN sub.status = 'RETURNED' THEN 1 ELSE 0 END) AS returnedCount, " +
            "SUM(CASE WHEN sub.status = 'EXCHANGED' THEN 1 ELSE 0 END) AS exchangedCount " +
            "FROM (SELECT p.transactionId AS transactionId, p.status AS status, SUM(p.price) AS totalPrice " +
            "      FROM Payment p " +
            "      GROUP BY p.transactionId, p.status) sub")
    List<Object[]> findTotalAndStatusStatistics();


    @Query("SELECT p FROM Payment p JOIN p.member m JOIN p.product pr WHERE p.transactionId = :transactionId")
    List<Payment> findByTransactionId(String transactionId);
}
