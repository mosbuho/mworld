package com.project.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "payment")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq_generator")
    @SequenceGenerator(name = "payment_seq_generator", sequenceName = "payment_seq", allocationSize = 1)
    private int no;

    @Column(name = "transaction_id", nullable = false, length = 36)
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "member_no", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "product_no", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false, length = 50)
    private String addr;

    @Column(name = "reg_date", columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime regDate;
}
