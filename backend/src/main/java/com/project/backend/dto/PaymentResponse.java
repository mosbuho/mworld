package com.project.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class PaymentResponse {

    private int no;
    private String transactionId;
    private int method;
    private int price;
    private LocalDateTime regDate;
    private int status;
    private String memberName;
    private String memberPhone;
    private String addr;
    private String detailAddr;


    public PaymentResponse(int no, String transactionId, int method, int price, LocalDateTime regDate, int status,
            String memberName, String memberPhone) {
        this.no = no;
        this.transactionId = transactionId;
        this.method = method;
        this.price = price;
        this.regDate = regDate;
        this.status = status;
        this.memberName = memberName;
        this.memberPhone = memberPhone;
    }

    public PaymentResponse(int no, String transactionId, int method, int price, LocalDateTime regDate, int status, String memberName, String memberPhone, String addr, String detailAddr) {
        this.no = no;
        this.transactionId = transactionId;
        this.method = method;
        this.price = price;
        this.regDate = regDate;
        this.status = status;
        this.memberName = memberName;
        this.memberPhone = memberPhone;
        this.addr = addr;
        this.detailAddr = detailAddr;
    }
}
