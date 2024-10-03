package com.project.backend.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.project.backend.dto.PaymentResponse;
import com.project.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.project.backend.entity.Payment;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }


    public Map<String, Object> getPaymentList(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);

        // transactionId로 그룹화된 결제 및 회원 정보 가져오기
        Page<Object[]> paymentPage = paymentRepository.findGroupedPayments(pageable);

        List<PaymentResponse> paymentList = paymentPage.getContent().stream().map(objects ->
                new PaymentResponse(
                        (String) objects[0],      // transactionId
                        (String) objects[1],      // method
                        ((Number) objects[2]).intValue(),  // totalPrice
                        (LocalDateTime) objects[3], // regDate
                        (String) objects[4],      // status
                        (String) objects[5],      // memberName
                        (String) objects[6]       // memberPhone
                )
        ).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("payments", paymentList);  // 실제 그룹화된 데이터
        result.put("totalPages", paymentPage.getTotalPages());  // 전체 페이지 수
        result.put("totalElements", paymentPage.getTotalElements());  // 전체 데이터 수

        return result;
    }
}
