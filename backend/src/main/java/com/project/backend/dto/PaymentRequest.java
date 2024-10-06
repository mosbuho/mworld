package com.project.backend.dto;

import lombok.Getter;

@Getter
public class PaymentRequest {
    private int ProductNo;
    private int quantity;
    private int price;
    private String method;
    private String addr;
}
