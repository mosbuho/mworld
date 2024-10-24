package com.project.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.backend.entity.Payment;
import com.project.backend.entity.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    @Query("SELECT p FROM Payment p " +
            "JOIN p.member m " +
            "WHERE (:f IS NULL OR LOWER(CASE WHEN :f = 'MEMBERNAME' THEN m.name " +
            "                                WHEN :f = 'MEMBERPHONE' THEN m.phone " +
            "                                WHEN :f = 'TRANSACTIONID' THEN p.transactionId " +
            "                                ELSE '' END) LIKE LOWER(CONCAT('%', :q, '%'))) " +
            "AND (:status IS NULL OR p.status = :status)")
    Page<Payment> findByFieldAndStatus(@Param("f") String f,
                                       @Param("q") String q,
                                       @Param("status") PaymentStatus status,
                                       Pageable pageable);

    @Query("SELECT COUNT(p), " +
            "SUM(CASE WHEN p.status NOT IN (:canceled, :refunded) THEN p.price ELSE 0 END), " +
            "SUM(CASE WHEN p.status = :canceled THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.status = :refunded THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.status = :returned THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.status = :exchanged THEN 1 ELSE 0 END) " +
            "FROM Payment p")
    List<Object[]> findTotalAndStatusStatistics(
            @Param("canceled") PaymentStatus canceled,
            @Param("refunded") PaymentStatus refunded,
            @Param("returned") PaymentStatus returned,
            @Param("exchanged") PaymentStatus exchanged);

    @Query(" SELECT p, pd " +
            "FROM Payment p " +
            "LEFT JOIN PaymentDetail pd ON p.no = pd.payment.no " +
            "WHERE p.no = :paymentNo")
    List<Object[]> findPaymentWithDetails(@Param("paymentNo") int paymentNo);
}