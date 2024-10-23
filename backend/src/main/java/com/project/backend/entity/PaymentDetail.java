package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_detail")
@Data
public class PaymentDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    @ManyToOne
    @JoinColumn(name = "product_no", nullable = true)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "payment_no", nullable = false)
    private Payment payment;

    @Column(name = "product_title", nullable = false, length = 255)
    private String productTitle;

    @Column(nullable = false)
    private int productPrice;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "reg_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime regDate;
}
