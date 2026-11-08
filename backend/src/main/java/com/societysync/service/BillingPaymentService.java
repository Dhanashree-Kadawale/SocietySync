package com.societysync.service;

import com.societysync.dto.MaintenanceBillDto;
import com.societysync.dto.PaymentDto;

import java.util.List;

public interface BillingPaymentService {
    List<MaintenanceBillDto> getBills(Long societyId, Long residentId, String status);
    MaintenanceBillDto getBillById(Long id);
    MaintenanceBillDto createBill(MaintenanceBillDto dto);
    MaintenanceBillDto updateBill(Long id, MaintenanceBillDto dto);
    PaymentDto payBill(Long billId, String paymentMethod, String transactionId);

    List<PaymentDto> getPayments(Long societyId, Long residentId);
}

