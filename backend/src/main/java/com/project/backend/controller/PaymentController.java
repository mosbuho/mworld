package com.project.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.dto.PaymentRequest;
import com.project.backend.service.PaymentService;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/admin/payment")
    public Map<String, Object> getPayment(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return paymentService.getPaymentList(page, size, f, q);
    }

    @GetMapping("/admin/payment-stats")
    public Map<String, Object> getPaymentStatistics() {
        return paymentService.getPaymentStatistics();
    }

    @PostMapping("/admin/payment")
    public ResponseEntity<String> createPayment(
            @RequestParam int memberNo,
            @RequestBody List<PaymentRequest> paymentRequests) {
        try {
            String orderNo = paymentService.createPaymnet(memberNo, paymentRequests);
            return ResponseEntity.ok(orderNo);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

}
