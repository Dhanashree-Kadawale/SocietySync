package com.societysync.repository;

import com.societysync.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findBySocietyId(Long societyId);
    List<Visitor> findBySocietyIdAndStatus(Long societyId, String status);
    List<Visitor> findByFlatId(Long flatId);
    Optional<Visitor> findByEntryPassCode(String entryPassCode);
}
