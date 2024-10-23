package com.project.backend.service;

import com.project.backend.entity.Notice;
import com.project.backend.repository.NoticeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public Notice createNotice(Notice notice) {

        return noticeRepository.save(notice);
    }

    public Map<String, Object> getNoticeWithPagination(int page, int size, String f, String q) {

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "regDate"));
        Page<Notice> noticePage;
        if (f != null && q != null && !q.isEmpty()) {
            noticePage = noticeRepository.findByField(f, q, pageable);
        } else {
            noticePage = noticeRepository.findAll(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("notices", noticePage.getContent());
        response.put("totalCount", noticePage.getTotalElements());
        response.put("totalPages", noticePage.getTotalPages());
        return response;
    }
}