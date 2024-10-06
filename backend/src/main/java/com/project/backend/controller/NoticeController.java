package com.project.backend.controller;

import com.project.backend.entity.Notice;
import com.project.backend.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // 공지사항 생성
    @PostMapping("/notice/create")
    public ResponseEntity<String> createNotice(@RequestBody Notice notice) {
        // 공지 생성 로직
        noticeService.createNotice(notice);
        return ResponseEntity.ok("공지사항이 성공적으로 생성되었습니다.");
    }

    @GetMapping("/notice")
    public Map<String, Object> getNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q){
        return noticeService.getNoticeWithPagination(page, size, f, q);
    }
}