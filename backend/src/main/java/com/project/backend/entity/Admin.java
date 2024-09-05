package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin")
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "admin_seq_generator")
    @SequenceGenerator(name = "admin_seq_generator", sequenceName = "admin_seq", allocationSize = 1)
    private int no;

    @Column(nullable = false, unique = true, length = 32)
    private String id;

    @Column(nullable = false, length = 100)
    private String pw;

    @Column(name = "reg_date", nullable = false, updatable = false, insertable = false, columnDefinition = "timestamp default systimestamp")
    private LocalDateTime regDate;
}
