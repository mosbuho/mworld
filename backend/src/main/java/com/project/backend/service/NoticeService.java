package com.project.backend.service;

import com.project.backend.entity.Notice;
import com.project.backend.repository.NoticeRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 공지사항 생성 로직
    public void createNotice(Notice notice) {
        notice.setRegDate(LocalDateTime.now());
        noticeRepository.save(notice);
    }

    // 공지사항 리스트 조회 로직 (페이지네이션 및 검색 기능 포함)
    public List<Notice> getNoticeList(int page, int size, String field, String query) {
        String jpql = "SELECT n FROM Notice n";

        // 검색 필터 추가
        if (!query.isEmpty()) {
            jpql += " WHERE LOWER(n." + field + ") LIKE LOWER(:query)";
        }

        jpql += " ORDER BY n.regDate DESC";

        Query noticeQuery = entityManager.createQuery(jpql, Notice.class);

        // 검색어가 있을 경우 쿼리 파라미터 설정
        if (!query.isEmpty()) {
            noticeQuery.setParameter("query", "%" + query + "%");
        }

        noticeQuery.setFirstResult((page - 1) * size);
        noticeQuery.setMaxResults(size);

        return noticeQuery.getResultList();
    }

    // 전체 공지사항 수 조회 로직
    public long getTotalNoticeCount(String field, String query) {
        String jpql = "SELECT COUNT(n) FROM Notice n";

        if (!query.isEmpty()) {
            jpql += " WHERE LOWER(n." + field + ") LIKE LOWER(:query)";
        }

        Query countQuery = entityManager.createQuery(jpql);

        if (!query.isEmpty()) {
            countQuery.setParameter("query", "%" + query + "%");
        }

        return (long) countQuery.getSingleResult();
    }
}