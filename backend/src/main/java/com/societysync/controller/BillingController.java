package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.MaintenanceBillDto;
import com.societysync.dto.PaymentDto;
import com.societysync.service.BillingPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bills")
public class BillingController {

    private final BillingPaymentService billingPaymentService;

    public BillingController(BillingPaymentService billingPaymentService) {
        this.billingPaymentService = billingPaymentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceBillDto>>> getBills(@RequestParam(required = false) Long societyId,
                                                                          @RequestParam(required = false) Long residentId,
                                                                          @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(billingPaymentService.getBills(societyId, residentId, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceBillDto>> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(billingPaymentService.getBillById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceBillDto>> createBill(@RequestBody MaintenanceBillDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Bill generated successfully", billingPaymentService.createBill(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceBillDto>> updateBill(@PathVariable Long id, @RequestBody MaintenanceBillDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Bill updated successfully", billingPaymentService.updateBill(id, dto)));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<ApiResponse<PaymentDto>> payBill(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String method = body != null ? body.get("paymentMethod") : "UPI";
        String txnId = body != null ? body.get("transactionId") : null;
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", billingPaymentService.payBill(id, method, txnId)));
    }
}

