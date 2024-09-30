package com.project.backend.controller;

import com.project.backend.entity.Notice;
import com.project.backend.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // 공지사항 생성하는
    @PostMapping("/notice/create")
    public ResponseEntity<String> createNotice(@RequestBody Notice notice) {
        // 공지 생성 로직
        noticeService.createNotice(notice);
        return ResponseEntity.ok("공지사항이 성공적으로 생성되었습니다.");
    }

    // 공지사항 리스트 조회 엔드포인트 (페이지네이션 및 검색 기능 추가)
    @GetMapping("/notice")
    public ResponseEntity<Map<String, Object>> getNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(defaultValue = "") String f,
            @RequestParam(defaultValue = "") String q
    ) {
        // 공지사항 목록과 전체 공지사항 수를 가져옴
        List<Notice> notices = noticeService.getNoticeList(page, size, f, q);
        long totalCount = noticeService.getTotalNoticeCount(f, q);

        Map<String, Object> response = new HashMap<>();
        response.put("notices", notices);
        response.put("totalCount", totalCount);

        return ResponseEntity.ok(response);
    }
}