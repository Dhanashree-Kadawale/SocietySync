package com.societysync.repository;

import com.societysync.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findBySocietyId(Long societyId);
    List<SupportTicket> findByStatus(String status);
}
