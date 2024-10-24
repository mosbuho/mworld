package com.project.backend.dto;

import lombok.Data;

@Data
public class PaymentDetailResponse {
    private int no;
    private int productNo;
    private String productTitle;;
    private int productPrice;
    private int quantity;

    public PaymentDetailResponse(int no, int productNo, String productTitle, int productPrice, int quantity) {
        this.no = no;
        this.productNo = productNo;
        this.productTitle = productTitle;
        this.productPrice = productPrice;
        this.quantity = quantity;
    }
}
