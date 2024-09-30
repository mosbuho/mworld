//package com.project.backend.service;
//
//import com.project.backend.entity.Notice;
//import com.project.backend.repository.NoticeRepository;
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.PersistenceContext;
//import jakarta.persistence.Query;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//public class NoticeService {
//
//    private final NoticeRepository noticeRepository;
//
//    @PersistenceContext
//    private EntityManager entityManager;
//
//    public NoticeService(NoticeRepository noticeRepository) {
//        this.noticeRepository = noticeRepository;
//    }
//
//    // 공지사항 생성 로직
//    public void createNotice(Notice notice) {
//        notice.setRegDate(LocalDateTime.now());
//        noticeRepository.save(notice);
//    }
//
//    // 공지사항 리스트 조회 로직 (페이지네이션 및 검색 기능 포함)
//    public List<Notice> getNoticeList(int page, int size, String field, String query) {
//        String jpql = "SELECT n FROM Notice n";
//
//        // 검색 필터 추가
//        if (!query.isEmpty()) {
//            jpql += " WHERE LOWER(n." + field + ") LIKE LOWER(:query)";
//        }
//
//        jpql += " ORDER BY n.regDate DESC";
//
//        Query noticeQuery = entityManager.createQuery(jpql, Notice.class);
//
//        // 검색어가 있을 경우 쿼리 파라미터 설정
//        if (!query.isEmpty()) {
//            noticeQuery.setParameter("query", "%" + query + "%");
//        }
//
//        noticeQuery.setFirstResult((page - 1) * size);
//        noticeQuery.setMaxResults(size);
//
//        return noticeQuery.getResultList();
//    }
//
//    // 전체 공지사항 수 조회 로직
//    public long getTotalNoticeCount(String field, String query) {
//        String jpql = "SELECT COUNT(n) FROM Notice n";
//
//        if (!query.isEmpty()) {
//            jpql += " WHERE LOWER(n." + field + ") LIKE LOWER(:query)";
//        }
//
//        Query countQuery = entityManager.createQuery(jpql);
//
//        if (!query.isEmpty()) {
//            countQuery.setParameter("query", "%" + query + "%");
//        }
//
//        return (long) countQuery.getSingleResult();
//    }
//}

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

        if (!query.isEmpty()) {
            if (field.equals("no")) {
                try {
                    // 검색어를 Integer로 변환
                    Integer numberQuery = Integer.parseInt(query);
                    jpql += " WHERE n.no = :no";
                    Query noticeQuery = entityManager.createQuery(jpql, Notice.class);
                    noticeQuery.setParameter("no", numberQuery);  // Integer로 설정
                    noticeQuery.setFirstResult((page - 1) * size);
                    noticeQuery.setMaxResults(size);
                    return noticeQuery.getResultList();
                } catch (NumberFormatException e) {
                    return List.of();  // 숫자로 변환되지 않으면 빈 리스트 반환
                }
            } else {
                jpql += " WHERE LOWER(n." + field + ") LIKE LOWER(:query)";
            }
        }

        jpql += " ORDER BY n.regDate DESC";
        Query noticeQuery = entityManager.createQuery(jpql, Notice.class);

        if (!query.isEmpty() && !field.equals("no")) {
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
            if (field.equals("no")) {
                try {
                    int numberQuery = Integer.parseInt(query); // 검색어를 숫자로 변환
                    jpql += " WHERE n.no = :no";
                    Query countQuery = entityManager.createQuery(jpql);
                    countQuery.setParameter("no", numberQuery);
                    return (long) countQuery.getSingleResult();
                } catch (NumberFormatException e) {
                    return 0L;
                }
            } else {
                jpql += " WHERE LOWER(n." + field + ") LIKE LOWER(:query)";
            }
        }

        Query countQuery = entityManager.createQuery(jpql);

        if (!query.isEmpty() && !field.equals("no")) {
            countQuery.setParameter("query", "%" + query + "%");
        }

        return (long) countQuery.getSingleResult();
    }
}