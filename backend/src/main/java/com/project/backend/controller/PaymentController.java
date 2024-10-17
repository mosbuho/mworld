package com.project.backend.controller;

import com.project.backend.dto.PaymentRequest;
import com.project.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/admin/payment")
    public Map<String, Object> getAllPayment(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "-1") int status) {
        return paymentService.getPaymentList(page, size, f, q, status);
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

    @GetMapping("/admin/payment/{transactionId}")
    public Map<String, Object> getPayment(@PathVariable String transactionId) {
        return paymentService.getPaymentDetails(transactionId);

    }
}
