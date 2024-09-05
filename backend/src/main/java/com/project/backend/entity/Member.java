package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

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

    @Column(length = 50)
    private String addr;

    @Column(name = "reg_date", nullable = false, updatable = false, insertable = false, columnDefinition = "timestamp default systimestamp")
    private LocalDateTime regDate;

    @Column(name = "provider", nullable = true)
    private String provider;

    @Column(name = "provider_id", nullable = true)
    private String providerId;

}
