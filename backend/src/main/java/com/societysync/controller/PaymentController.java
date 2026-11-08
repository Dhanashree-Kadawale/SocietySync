package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.PaymentDto;
import com.societysync.service.BillingPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final BillingPaymentService billingPaymentService;

    public PaymentController(BillingPaymentService billingPaymentService) {
        this.billingPaymentService = billingPaymentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDto>>> getPayments(@RequestParam(required = false) Long societyId,
                                                                     @RequestParam(required = false) Long residentId) {
        return ResponseEntity.ok(ApiResponse.ok(billingPaymentService.getPayments(societyId, residentId)));
    }
}

