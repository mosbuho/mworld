package com.project.backend.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MemberResponse {
    private int no;
    private String id;
    private String name;
    private String phone;
    private String email;
    private String business;
    private String addr;
    private String detailAddr;
    private LocalDateTime regDate;

    // 생성자
    public MemberResponse(int no, String id, String name, String phone, String addr, LocalDateTime regDate) {
        this.no = no;
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.addr = addr;
        this.regDate = regDate;
    }
    public MemberResponse(int no, String id, String name, String phone, String email, String business, String addr, String detailAddr, LocalDateTime regDate) {
        this.no = no;
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.business = business;
        this.addr = addr;
        this.detailAddr = detailAddr;
        this.regDate = regDate;
    }
}
