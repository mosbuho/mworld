package com.project.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductResponse {
    private int no;
    private String title;
    private String category;
    private int quantity;
    private int price;
    private String titleImg;
    private String content;

    // 어드민 생성자
    public ProductResponse(int no, String title, String category, int quantity, int price) {
        this.no = no;
        this.title = title;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
    }

    public ProductResponse(int no, String title, String category, String titleImg, int price, int quantity, String content) {
        this.no = no;
        this.title = title;
        this.category = category;
        this.titleImg = titleImg;
        this.price = price;
        this.quantity = quantity;
        this.content = content;
    }

    // 멤버 생성자
    public ProductResponse(int no, String title, String titleImg, int price) {
        this.no = no;
        this.title = title;
        this.titleImg = titleImg;
        this.price = price;
    }

    public ProductResponse(int no, String title, String titleImg, int price, int quantity, String content) {
        this.no = no;
        this.title = title;
        this.titleImg = titleImg;
        this.price = price;
        this.quantity = quantity;
        this.content = content;
    }
}
