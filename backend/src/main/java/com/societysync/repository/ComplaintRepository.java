package com.societysync.repository;

import com.societysync.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findBySocietyId(Long societyId);
    List<Complaint> findBySocietyIdAndStatus(Long societyId, String status);
    List<Complaint> findByResidentId(Long residentId);
    List<Complaint> findByAssignedStaffId(Long staffId);
}
