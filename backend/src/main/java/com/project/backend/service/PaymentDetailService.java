package com.project.backend.service;

import com.project.backend.repository.PaymentDetailRepository;
import org.springframework.stereotype.Service;


@Service
public class PaymentDetailService {

    private final PaymentDetailRepository paymentDetailRepository;

    public PaymentDetailService(PaymentDetailRepository paymentDetailRepository) {
        this.paymentDetailRepository = paymentDetailRepository;
    }

}
