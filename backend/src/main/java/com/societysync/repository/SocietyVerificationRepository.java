package com.societysync.repository;

import com.societysync.entity.SocietyVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocietyVerificationRepository extends JpaRepository<SocietyVerification, Long> {
    List<SocietyVerification> findByStatus(String status);
}
