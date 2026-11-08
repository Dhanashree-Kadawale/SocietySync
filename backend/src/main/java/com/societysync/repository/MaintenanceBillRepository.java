package com.societysync.repository;

import com.societysync.entity.MaintenanceBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceBillRepository extends JpaRepository<MaintenanceBill, Long> {
    List<MaintenanceBill> findBySocietyId(Long societyId);
    List<MaintenanceBill> findBySocietyIdAndStatus(Long societyId, String status);
    List<MaintenanceBill> findByFlatId(Long flatId);
    List<MaintenanceBill> findByResidentId(Long residentId);
    Optional<MaintenanceBill> findByBillNumber(String billNumber);
}
