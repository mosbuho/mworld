package com.project.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "payment")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int no;

    @Column(name = "transaction_id", nullable = false, length = 36)
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "member_no", nullable = true)
    private Member member;

    @Column(nullable = false)
    private int price;

    @Column(name = "use_point", nullable = false)
    private int usePoint;

    @Column(nullable = false, length = 50)
    private String addr;

    @Column(name = "detail_addr", nullable = false, length = 50)
    private String detailAddr;

    @Column(nullable = false)
    private int method;

    @Enumerated(EnumType.ORDINAL)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "reg_date", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime regDate;
}
