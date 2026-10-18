package com.societysync.repository;

import com.societysync.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findBySocietyId(Long societyId);
    List<Expense> findBySocietyIdAndStatus(Long societyId, String status);
}
