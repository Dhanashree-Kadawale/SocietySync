package com.societysync.repository;

import com.societysync.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findBySocietyIdOrderByCreatedAtDesc(Long societyId);
    List<AuditLog> findAllByOrderByCreatedAtDesc();
}
