package com.project.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.entity.Notice;
import com.project.backend.service.NoticeService;

@RestController
@RequestMapping("/api")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @PostMapping("/notice/create")
    public ResponseEntity<String> createNotice(@RequestBody Notice notice) {
        try {
            Notice savedNotice = noticeService.createNotice(notice);
            return ResponseEntity.ok(savedNotice.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/notice")
    public Map<String, Object> getNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return noticeService.getNoticeWithPagination(page, size, f, q);
    }
}