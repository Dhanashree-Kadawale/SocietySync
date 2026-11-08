package com.societysync.service;

import com.societysync.dto.ExpenseDto;

import java.util.List;

public interface ExpenseService {
    List<ExpenseDto> getExpenses(Long societyId, String status);
    ExpenseDto getExpenseById(Long id);
    ExpenseDto createExpense(ExpenseDto dto);
    ExpenseDto updateExpenseStatus(Long id, String status);
    void deleteExpense(Long id);
}

