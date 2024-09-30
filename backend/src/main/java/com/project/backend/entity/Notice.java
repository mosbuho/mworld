package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notice")
@Data
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notice_seq_generator")
    @SequenceGenerator(name = "notice_seq_generator", sequenceName = "notice_seq", allocationSize = 1)
    private int no;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 4000)
    private String content;

    @Column(name = "reg_date", nullable = false, updatable = false, columnDefinition = "timestamp default systimestamp")
    private LocalDateTime regDate;
}