package com.project.backend.dto;

import lombok.Getter;

@Getter
public class PaymentRequest {
    private int ProductNo;
    private int quantity;
    private int price;
    private int method;
    private String addr;

    public PaymentRequest(int productNo, int quantity, int price, int method, String addr) {
        this.ProductNo = productNo;
        this.quantity = quantity;
        this.price = price;
        this.method = method;
        this.addr = addr;
    }
}
