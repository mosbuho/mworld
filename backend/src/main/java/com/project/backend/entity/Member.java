package com.project.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "member")
@Data
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "member_seq")
    @SequenceGenerator(name = "member_seq", sequenceName = "member_seq", allocationSize = 1)
    private int no;

    @Column(nullable = false, unique = true, length = 100)
    private String id;

    @Column(nullable = false, length = 100)
    private String pw;

    @Column(nullable = false, length = 32)
    private String name;

    @Column(nullable = false, length = 11)
    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 10)
    private String business;

    @Column(length = 50)
    private String addr;

    @Column(name = "detail_addr", length = 50)
    private String detailAddr;

    @Column(name = "reg_date", nullable = false, updatable = false, insertable = false, columnDefinition = "timestamp default systimestamp")
    private LocalDateTime regDate;
}
