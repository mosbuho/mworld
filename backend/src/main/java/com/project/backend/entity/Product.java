package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq_generator")
    @SequenceGenerator(name = "product_seq_generator", sequenceName = "product_seq", allocationSize = 1)
    private int no;

    @Column(name = "title_img", nullable = false, length = 255)
    private String titleImg;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 4000)
    private String content;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int discount;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int minimum;

    @Column(name = "reg_date", columnDefinition = "TIMESTAMP DEFAULT SYSTIMESTAMP")
    private LocalDateTime regDate;
}