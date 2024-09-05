package com.project.backend.controller;

import com.project.backend.entity.Member;
import com.project.backend.service.MemberService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/admin/main")
    public List<Member> getMember(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return memberService.getMemberList(page, size);
    }

    @GetMapping("/admin")
    public Map<String, Object> getAllMember(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return memberService.getMemberWithPagination(page, size, f, q, startDate, endDate);
    }

    @PutMapping("/admin/{no}")
    public ResponseEntity<String> updateMember(
            @PathVariable int no,
            @RequestBody Member updatedMember
    ) {
        try {
            memberService.updateMember(no, updatedMember);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/admin/{no}")
    public ResponseEntity<String> deleteMember(@PathVariable int no) {
        try {
            memberService.deleteMember(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
