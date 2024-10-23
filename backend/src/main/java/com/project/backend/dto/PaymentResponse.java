package com.project.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class PaymentResponse {

    private String transactionId;
    private int method;
    private int price;
    private LocalDateTime regDate;
    private String status;
    private String memberName;
    private String memberPhone;

    public PaymentResponse(String transactionId, int method, int price, LocalDateTime regDate, String status,
            String memberName, String memberPhone) {
        this.transactionId = transactionId;
        this.method = method;
        this.price = price;
        this.regDate = regDate;
        this.status = status;
        this.memberName = memberName;
        this.memberPhone = memberPhone;
    }
}
