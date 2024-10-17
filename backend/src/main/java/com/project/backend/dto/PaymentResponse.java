package com.project.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentResponse {

    private String transactionId;
    private String method;
    private int price;
    private LocalDateTime regDate;
    private String status;
    private String memberName;
    private String memberPhone;
    private String productTitle;

    public PaymentResponse(String transactionId, String method, int price, LocalDateTime regDate, String status,
            String memberName, String memberPhone) {
        this.transactionId = transactionId;
        this.method = method;
        this.price = price;
        this.regDate = regDate;
        this.status = status;
        this.memberName = memberName;
        this.memberPhone = memberPhone;
    }

    public PaymentResponse(String transactionId, String method, int price, LocalDateTime regDate, String status,
            String memberName, String memberPhone, String productTitle) {
        this(transactionId, method, price, regDate, status, memberName, memberPhone);
        this.productTitle = productTitle;
    }
}
