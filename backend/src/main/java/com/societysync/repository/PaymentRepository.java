package com.societysync.repository;

import com.societysync.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findBySocietyId(Long societyId);
    List<Payment> findByResidentId(Long residentId);
    Optional<Payment> findByReceiptNumber(String receiptNumber);
}
