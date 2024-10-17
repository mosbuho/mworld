package com.project.backend.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.project.backend.dto.PaymentRequest;
import com.project.backend.dto.PaymentResponse;
import com.project.backend.entity.Member;
import com.project.backend.entity.Payment;
import com.project.backend.entity.Product;
import com.project.backend.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Map<String, Object> getPaymentList(int page, int size, String f, String q) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Object[]> paymentPage;

        if (f == null || q == null || q.isEmpty()) {
            paymentPage = paymentRepository.findGroupedPayments(pageable);
        } else {
            paymentPage = paymentRepository.findGroupedPaymentsByField(f, q, pageable);
        }

        List<PaymentResponse> paymentList = paymentPage.getContent().stream().map(objects -> new PaymentResponse(
                (String) objects[0],
                (String) objects[1],
                ((Number) objects[2]).intValue(),
                (LocalDateTime) objects[3],
                (String) objects[4],
                (String) objects[5],
                (String) objects[6])).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("paymentList", paymentList);
        response.put("totalPages", paymentPage.getTotalPages());
        response.put("totalElements", paymentPage.getTotalElements());

        return response;
    }

    public Map<String, Object> getPaymentStatistics() {
        List<Object[]> stats = paymentRepository.findTotalAndStatusStatistics();

        Object[] result = stats.get(0);

        int totalOrders = ((Number) result[0]).intValue();
        long totalPrice = ((Number) result[1]).longValue();
        int canceledCount = ((Number) result[2]).intValue();
        int refundedCount = ((Number) result[3]).intValue();
        int returnedCount = ((Number) result[4]).intValue();
        int exchangedCount = ((Number) result[5]).intValue();

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
                payment.setProduct(product);
                payment.setQuantity(request.getQuantity());
                payment.setPrice(request.getPrice());
                payment.setMethod(request.getMethod());
                payment.setStatus("PAYMENTED");
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
}
