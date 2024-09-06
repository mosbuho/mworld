package com.project.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

}
