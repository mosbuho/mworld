package com.project.backend.repository;

import com.project.backend.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository <Notice, Integer> {
    Notice findNoticeByNo(int no);
}
