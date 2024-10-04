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
                        (String) objects[0],
                        (String) objects[1],
                        ((Number) objects[2]).intValue(),
                        (LocalDateTime) objects[3],
                        (String) objects[4],
                        (String) objects[5],
                        (String) objects[6]
                )
        ).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("payments", paymentList);  // 실제 그룹화된 데이터
        response.put("totalPages", paymentPage.getTotalPages());  // 전체 페이지 수
        response.put("totalElements", paymentPage.getTotalElements());  // 전체 데이터 수

        return response;
    }

    public Map<String, Object> getPaymentStatistics() {
        List<Object[]> stats = paymentRepository.findTotalAndStatusStatistics();

        Object[] result = stats.get(0);

        int totalOrders = ((Number) result[0]).intValue();   // int로 처리
        long totalPrice = ((Number) result[1]).longValue();  // long으로 처리
        int canceledCount = ((Number) result[2]).intValue();
        int refundedCount = ((Number) result[3]).intValue();
        int returnedCount = ((Number) result[4]).intValue();
        int exchangedCount = ((Number) result[5]).intValue();

        Map<String, Object> response = new HashMap<>();
        response.put("total", totalOrders);
        response.put("totalPrice", totalPrice);  // long 타입으로 변경된 totalPrice
        response.put("canceled", canceledCount);
        response.put("refunded", refundedCount);
        response.put("returned", returnedCount);
        response.put("exchanged", exchangedCount);

        return response;
    }
}
