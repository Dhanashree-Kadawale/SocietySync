package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.ExpenseDto;
import com.societysync.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseDto>>> getExpenses(@RequestParam(required = false) Long societyId,
                                                                     @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(expenseService.getExpenses(societyId, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseDto>> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(expenseService.getExpenseById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseDto>> createExpense(@RequestBody ExpenseDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Expense recorded successfully", expenseService.createExpense(dto)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ExpenseDto>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.ok("Expense status updated", expenseService.updateExpenseStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.ok("Expense deleted successfully", null));
    }
}

