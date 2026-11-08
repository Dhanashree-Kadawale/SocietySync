package com.societysync.repository;

import com.societysync.entity.Poll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {
    List<Poll> findBySocietyId(Long societyId);
    List<Poll> findBySocietyIdAndStatus(Long societyId, String status);
    java.util.Optional<Poll> findByIdAndSocietyId(Long id, Long societyId);
}
