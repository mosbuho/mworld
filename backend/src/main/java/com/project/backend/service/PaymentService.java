package com.project.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import com.project.backend.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.backend.dto.PaymentRequest;
import com.project.backend.dto.PaymentResponse;
import com.project.backend.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Map<String, Object> getPaymentList(int page, int size, String f, String q, int status) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Payment> paymentPage;

        PaymentStatus paymentStatus = status == -1 ? null : PaymentStatus.fromValue(status);

        if (f == null || q == null || q.isEmpty()) {
            paymentPage = (paymentStatus == null)
                    ? paymentRepository.findAll(pageable) // 모든 결제 조회
                    : paymentRepository.findByStatus(paymentStatus, pageable); // 상태별 조회
        } else {
            paymentPage = paymentRepository.findByFieldAndStatus(f, q, paymentStatus, pageable); // 필드와 상태 검색
        }

        List<PaymentResponse> paymentList = paymentPage.getContent().stream().map(payment ->
                new PaymentResponse(
                        payment.getNo(),
                        payment.getTransactionId(),
                        payment.getMethod(),
                        payment.getPrice(),
                        payment.getRegDate(),
                        payment.getStatus().getValue(),
                        payment.getMember().getName(),
                        payment.getMember().getPhone()
                )
        ).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("paymentList", paymentList);
        response.put("totalPages", paymentPage.getTotalPages());
        response.put("totalElements", paymentPage.getTotalElements());

        return response;
    }

    public Map<String, Object> getPaymentStatistics() {
        List<Object[]> stats = paymentRepository.findTotalAndStatusStatistics(
                PaymentStatus.CANCELED,
                PaymentStatus.REFUNDED,
                PaymentStatus.RETURNED,
                PaymentStatus.EXCHANGED);

        Object[] result = stats.isEmpty() ? new Object[6] : stats.get(0);

        int totalOrders = result[0] != null ? ((Number) result[0]).intValue() : 0;
        long totalPrice = result[1] != null ? ((Number) result[1]).longValue() : 0;
        int canceledCount = result[2] != null ? ((Number) result[2]).intValue() : 0;
        int refundedCount = result[3] != null ? ((Number) result[3]).intValue() : 0;
        int returnedCount = result[4] != null ? ((Number) result[4]).intValue() : 0;
        int exchangedCount = result[5] != null ? ((Number) result[5]).intValue() : 0;

        Map<String, Object> response = new HashMap<>();
        response.put("total", totalOrders);
        response.put("totalPrice", totalPrice);
        response.put("canceled", canceledCount);
        response.put("refunded", refundedCount);
        response.put("returned", returnedCount);
        response.put("exchanged", exchangedCount);

        return response;
    }

    public String createPaymnet(int memberNo, List<PaymentRequest> requestList) {
        try {
            if (requestList == null || requestList.isEmpty()) {
                throw new IllegalArgumentException("requestList is null or empty");
            }
            Member member = new Member();
            member.setNo(memberNo);

            String orderNo = generateOrderNo();

            List<Payment> payments = requestList.stream().map(request -> {
                Payment payment = new Payment();
                payment.setTransactionId(orderNo);
                Product product = new Product();
                product.setNo(request.getProductNo());
                payment.setPrice(request.getPrice());
                payment.setMethod(request.getMethod());
                payment.setStatus(PaymentStatus.PAYMENTED);
                payment.setAddr(request.getAddr());
                payment.setRegDate(LocalDateTime.now());
                return payment;
            }).collect(Collectors.toList());

            paymentRepository.saveAll(payments);
            return orderNo;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid payment data", e);
        } catch (Exception e) {
            throw new RuntimeException();
        }

    }

    private String generateOrderNo() {
        String characters = "ABCDEFGHJKMNPQRSTUVWXYZ134679";
        Random random = new Random();
        StringBuilder randomString = new StringBuilder(6);

        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(characters.length());
            randomString.append(characters.charAt(index));
        }

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
        String formattedDateTime = now.format(formatter);

        return formattedDateTime + randomString.toString();
    }

    public Map<String, Object> getPaymentWithDetails(int paymentNo) {
        List<Object[]> results = paymentRepository.findPaymentWithDetails(paymentNo);

        Payment payment = (Payment) results.get(0)[0];

        PaymentResponse paymentInfo = new PaymentResponse(
                payment.getNo(),
                payment.getTransactionId(),
                payment.getMethod(),
                payment.getPrice(),
                payment.getRegDate(),
                payment.getStatus().getValue(),
                payment.getMember().getName(),
                payment.getMember().getPhone(),
                payment.getAddr(),
                payment.getDetailAddr()
        );
        List<PaymentDetail> productList = results.stream()
                .map(row -> (PaymentDetail) row[1])
                .filter(Objects::nonNull)
                .collect(Collectors.toList());


        Map<String, Object> response = new HashMap<>();
        response.put("paymentInfo", paymentInfo);
        response.put("productList", productList);

        return response;
    }
//
//    @Transactional
//    public void updatePaymentStatus(String transactionId, int statusValue) {
//        PaymentStatus status = PaymentStatus.fromValue(statusValue);
//
//        int updatedCount = paymentRepository.updatePaymentStatus(transactionId, status);
//
//        if (updatedCount == 0) {
//            throw new IllegalArgumentException("No payment found for transactionId: " + transactionId);
//        }
//    }
}