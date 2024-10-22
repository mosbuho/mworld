package com.project.backend.repository;

import com.project.backend.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

    @Query("SELECT n FROM Notice n WHERE " +
            "((:f = 'TITLE' AND n.title LIKE %:q%) OR " +
            "(:f = 'CONTENT' AND n.content LIKE %:q%) OR " +
            "(:q IS NULL OR :q = ''))")
    Page<Notice> findByField(
            @Param("f") String f,
            @Param("q") String q,
            Pageable pageable);


}
