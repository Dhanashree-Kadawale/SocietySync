package com.societysync.repository;

import com.societysync.entity.SocietyDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocietyDocumentRepository extends JpaRepository<SocietyDocument, Long> {
    List<SocietyDocument> findBySocietyId(Long societyId);
    List<SocietyDocument> findBySocietyIdAndCategory(Long societyId, String category);
}
