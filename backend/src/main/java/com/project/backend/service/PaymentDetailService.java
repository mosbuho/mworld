package com.project.backend.service;

import org.springframework.stereotype.Service;

import com.project.backend.repository.PaymentDetailRepository;

@Service
public class PaymentDetailService {

    private final PaymentDetailRepository paymentDetailRepository;

    public PaymentDetailService(PaymentDetailRepository paymentDetailRepository) {
        this.paymentDetailRepository = paymentDetailRepository;
    }

}
