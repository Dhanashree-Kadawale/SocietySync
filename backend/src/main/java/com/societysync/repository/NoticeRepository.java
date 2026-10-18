package com.societysync.repository;

import com.societysync.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findBySocietyIdOrderByPostedAtDesc(Long societyId);
    List<Notice> findBySocietyIdAndIsPinnedTrue(Long societyId);
}
