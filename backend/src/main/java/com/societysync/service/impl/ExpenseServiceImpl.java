package com.societysync.service.impl;

import com.societysync.dto.ExpenseDto;
import com.societysync.entity.Expense;
import com.societysync.entity.Society;
import com.societysync.entity.User;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.ExpenseRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.ExpenseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository,
                              SocietyRepository societyRepository,
                              UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseDto> getExpenses(Long societyId, String status) {
        List<Expense> list = (societyId != null)
                ? expenseRepository.findBySocietyId(societyId)
                : expenseRepository.findAll();
        if (status != null && !status.isEmpty()) {
            list = list.stream().filter(e -> status.equalsIgnoreCase(e.getStatus())).collect(Collectors.toList());
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseDto getExpenseById(Long id) {
        Expense e = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found: " + id));
        return toDto(e);
    }

    @Override
    @Transactional
    public ExpenseDto createExpense(ExpenseDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        User approver = null;
        if (dto.getApprovedById() != null) {
            approver = userRepository.findById(dto.getApprovedById()).orElse(null);
        }

        Expense e = new Expense();
        e.setSociety(society);
        e.setApprovedBy(approver);
        e.setTitle(dto.getTitle());
        e.setCategory(dto.getCategory() != null ? dto.getCategory() : "Maintenance");
        e.setAmount(dto.getAmount() != null ? dto.getAmount() : BigDecimal.ZERO);
        e.setExpenseDate(dto.getExpenseDate() != null ? dto.getExpenseDate() : LocalDate.now());
        e.setVendorName(dto.getVendorName() != null ? dto.getVendorName() : "General Vendor");
        e.setStatus(dto.getStatus() != null ? dto.getStatus() : "APPROVED");
        e.setReceiptUrl(dto.getReceiptUrl());

        return toDto(expenseRepository.save(e));
    }

    @Override
    @Transactional
    public ExpenseDto updateExpenseStatus(Long id, String status) {
        Expense e = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found: " + id));
        e.setStatus(status);
        e.setUpdatedAt(LocalDateTime.now());
        return toDto(expenseRepository.save(e));
    }

    @Override
    @Transactional
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found: " + id);
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseDto toDto(Expense e) {
        ExpenseDto d = new ExpenseDto();
        d.setId(e.getId());
        if (e.getSociety() != null) d.setSocietyId(e.getSociety().getId());
        if (e.getApprovedBy() != null) {
            d.setApprovedById(e.getApprovedBy().getId());
            d.setApprovedByName(e.getApprovedBy().getName());
        }
        d.setTitle(e.getTitle());
        d.setCategory(e.getCategory());
        d.setAmount(e.getAmount());
        d.setExpenseDate(e.getExpenseDate());
        d.setVendorName(e.getVendorName());
        d.setStatus(e.getStatus());
        d.setReceiptUrl(e.getReceiptUrl());
        return d;
    }
}

