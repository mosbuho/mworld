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

    @Column(name = "reg_date", columnDefinition = "timestamp default systimestamp")
    private LocalDateTime regDate;

    @PrePersist
    public void prePersist() {
        this.regDate = this.regDate != null ? this.regDate : LocalDateTime.now();
    }
}