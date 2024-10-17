package com.project.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.entity.Member;
import com.project.backend.service.MemberService;

@RestController
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/admin/member-main")
    public List<Member> getMember(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size) {
        return memberService.getMemberList(page, size);
    }

    @GetMapping("/admin/member")
    public Map<String, Object> getAllMember(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String f,
            @RequestParam(required = false) String q) {
        return memberService.getMemberWithPagination(page, size, f, q);
    }

    @PutMapping("/admin/member/{no}")
    public ResponseEntity<String> updateMember(
            @PathVariable int no,
            @RequestBody Member updatedMember) {
        try {
            memberService.updateMember(no, updatedMember);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/admin/member/{no}")
    public ResponseEntity<String> deleteMember(@PathVariable int no) {
        try {
            memberService.deleteMember(no);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
