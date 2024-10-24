package com.project.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.backend.entity.PaymentDetail;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetail, Integer> {
}
