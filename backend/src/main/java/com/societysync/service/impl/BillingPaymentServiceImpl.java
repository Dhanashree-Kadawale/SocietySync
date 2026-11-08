package com.societysync.service.impl;

import com.societysync.dto.MaintenanceBillDto;
import com.societysync.dto.PaymentDto;
import com.societysync.entity.Flat;
import com.societysync.entity.MaintenanceBill;
import com.societysync.entity.Payment;
import com.societysync.entity.Resident;
import com.societysync.entity.Society;
import com.societysync.exception.BadRequestException;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.FlatRepository;
import com.societysync.repository.MaintenanceBillRepository;
import com.societysync.repository.PaymentRepository;
import com.societysync.repository.ResidentRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.service.BillingPaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BillingPaymentServiceImpl implements BillingPaymentService {

    private final MaintenanceBillRepository billRepository;
    private final PaymentRepository paymentRepository;
    private final SocietyRepository societyRepository;
    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;

    public BillingPaymentServiceImpl(MaintenanceBillRepository billRepository,
                                     PaymentRepository paymentRepository,
                                     SocietyRepository societyRepository,
                                     FlatRepository flatRepository,
                                     ResidentRepository residentRepository) {
        this.billRepository = billRepository;
        this.paymentRepository = paymentRepository;
        this.societyRepository = societyRepository;
        this.flatRepository = flatRepository;
        this.residentRepository = residentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceBillDto> getBills(Long societyId, Long residentId, String status) {
        List<MaintenanceBill> list;
        if (residentId != null) {
            list = billRepository.findByResidentId(residentId);
        } else if (societyId != null && status != null && !status.isEmpty()) {
            list = billRepository.findBySocietyIdAndStatus(societyId, status);
        } else if (societyId != null) {
            list = billRepository.findBySocietyId(societyId);
        } else {
            list = billRepository.findAll();
        }
        return list.stream().map(this::toBillDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceBillDto getBillById(Long id) {
        MaintenanceBill b = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance bill not found: " + id));
        return toBillDto(b);
    }

    @Override
    @Transactional
    public MaintenanceBillDto createBill(MaintenanceBillDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        Flat flat = null;
        if (dto.getFlatId() != null) {
            flat = flatRepository.findById(dto.getFlatId()).orElse(null);
        } else if (dto.getFlatNumber() != null && society != null) {
            flat = flatRepository.findBySocietyId(society.getId()).stream()
                    .filter(f -> f.getFlatNumber().equalsIgnoreCase(dto.getFlatNumber()))
                    .findFirst().orElse(null);
        }

        if (flat == null && society != null) {
            flat = flatRepository.findBySocietyId(society.getId()).stream().findFirst().orElse(null);
        }
        if (flat == null) {
            flat = flatRepository.findAll().stream().findFirst().orElse(null);
        }

        if (flat == null) {
            throw new BadRequestException("No flats exist in the society to generate a maintenance bill");
        }

        Resident resident = null;
        if (dto.getResidentId() != null) {
            resident = residentRepository.findById(dto.getResidentId()).orElse(null);
        } else {
            resident = residentRepository.findByFlatId(flat.getId()).orElse(null);
        }

        MaintenanceBill b = new MaintenanceBill();
        b.setSociety(society);
        b.setFlat(flat);
        b.setResident(resident);

        String month = dto.getBillingMonth() != null ? dto.getBillingMonth() : LocalDate.now().getMonth().name();
        int year = dto.getBillingYear() != null ? dto.getBillingYear() : LocalDate.now().getYear();

        String defBillNum = "BILL-" + year + "-" + month.substring(0, Math.min(3, month.length())).toUpperCase() + "-" + flat.getFlatNumber() + "-" + (System.currentTimeMillis() % 100000);
        b.setBillNumber(dto.getBillNumber() != null ? dto.getBillNumber() : defBillNum);
        b.setBillingMonth(month);
        b.setBillingYear(year);

        BigDecimal base = dto.getBaseAmount() != null ? dto.getBaseAmount() : BigDecimal.valueOf(3500);
        BigDecimal sinking = dto.getSinkingFund() != null ? dto.getSinkingFund() : BigDecimal.valueOf(500);
        BigDecimal water = dto.getWaterCharges() != null ? dto.getWaterCharges() : BigDecimal.valueOf(300);
        BigDecimal parking = dto.getParkingCharges() != null ? dto.getParkingCharges() : BigDecimal.valueOf(200);
        BigDecimal penalty = dto.getPenaltyAmount() != null ? dto.getPenaltyAmount() : BigDecimal.ZERO;
        BigDecimal total = base.add(sinking).add(water).add(parking).add(penalty);

        b.setBaseAmount(base);
        b.setSinkingFund(sinking);
        b.setWaterCharges(water);
        b.setParkingCharges(parking);
        b.setPenaltyAmount(penalty);
        b.setTotalAmount(dto.getTotalAmount() != null ? dto.getTotalAmount() : total);
        b.setStatus(dto.getStatus() != null ? dto.getStatus() : "UNPAID");
        b.setIssuedDate(dto.getIssuedDate() != null ? dto.getIssuedDate() : LocalDate.now());
        b.setDueDate(dto.getDueDate() != null ? dto.getDueDate() : LocalDate.now().plusDays(25));

        return toBillDto(billRepository.save(b));
    }

    @Override
    @Transactional
    public MaintenanceBillDto updateBill(Long id, MaintenanceBillDto dto) {
        MaintenanceBill b = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance bill not found: " + id));

        if (dto.getStatus() != null) b.setStatus(dto.getStatus());
        if (dto.getPenaltyAmount() != null) b.setPenaltyAmount(dto.getPenaltyAmount());
        if (dto.getTotalAmount() != null) b.setTotalAmount(dto.getTotalAmount());
        if (dto.getDueDate() != null) b.setDueDate(dto.getDueDate());
        b.setUpdatedAt(LocalDateTime.now());

        return toBillDto(billRepository.save(b));
    }

    @Override
    @Transactional
    public PaymentDto payBill(Long billId, String paymentMethod, String transactionId) {
        MaintenanceBill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found: " + billId));

        bill.setStatus("PAID");
        bill.setPaidDate(LocalDate.now());
        bill.setPaymentMode(paymentMethod != null ? paymentMethod : "UPI");
        String receiptNumber = "REC-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        bill.setReceiptNumber(receiptNumber);
        bill.setUpdatedAt(LocalDateTime.now());
        billRepository.save(bill);

        Payment p = new Payment();
        p.setSociety(bill.getSociety());
        p.setBill(bill);
        p.setFlat(bill.getFlat());
        p.setResident(bill.getResident());
        p.setReceiptNumber(receiptNumber);
        p.setAmount(bill.getTotalAmount());
        p.setPaymentDate(LocalDateTime.now());
        p.setPaymentType("MAINTENANCE");
        p.setPaymentMethod(bill.getPaymentMode());
        p.setTransactionId(transactionId != null ? transactionId : "TXN-" + System.currentTimeMillis());
        p.setStatus("SUCCESS");

        Payment savedPayment = paymentRepository.save(p);
        return toPaymentDto(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDto> getPayments(Long societyId, Long residentId) {
        List<Payment> list;
        if (residentId != null) {
            list = paymentRepository.findByResidentId(residentId);
        } else if (societyId != null) {
            list = paymentRepository.findBySocietyId(societyId);
        } else {
            list = paymentRepository.findAll();
        }
        return list.stream().map(this::toPaymentDto).collect(Collectors.toList());
    }

    private MaintenanceBillDto toBillDto(MaintenanceBill b) {
        MaintenanceBillDto d = new MaintenanceBillDto();
        d.setId(b.getId());
        if (b.getSociety() != null) d.setSocietyId(b.getSociety().getId());
        if (b.getFlat() != null) {
            d.setFlatId(b.getFlat().getId());
            d.setFlatNumber(b.getFlat().getFlatNumber());
        }
        if (b.getResident() != null) {
            d.setResidentId(b.getResident().getId());
            d.setResidentName(b.getResident().getName());
        }
        d.setBillNumber(b.getBillNumber());
        d.setBillingMonth(b.getBillingMonth());
        d.setBillingYear(b.getBillingYear());
        d.setBaseAmount(b.getBaseAmount());
        d.setSinkingFund(b.getSinkingFund());
        d.setWaterCharges(b.getWaterCharges());
        d.setParkingCharges(b.getParkingCharges());
        d.setPenaltyAmount(b.getPenaltyAmount());
        d.setTotalAmount(b.getTotalAmount());
        d.setStatus(b.getStatus());
        d.setDueDate(b.getDueDate());
        d.setIssuedDate(b.getIssuedDate());
        d.setPaidDate(b.getPaidDate());
        d.setPaymentMode(b.getPaymentMode());
        d.setReceiptNumber(b.getReceiptNumber());
        return d;
    }

    private PaymentDto toPaymentDto(Payment p) {
        PaymentDto d = new PaymentDto();
        d.setId(p.getId());
        if (p.getSociety() != null) d.setSocietyId(p.getSociety().getId());
        if (p.getBill() != null) {
            d.setBillId(p.getBill().getId());
            d.setBillingMonth(p.getBill().getBillingMonth());
            d.setBillingYear(p.getBill().getBillingYear());
        }
        if (p.getResident() != null) {
            d.setResidentId(p.getResident().getId());
            d.setResidentName(p.getResident().getName());
        }
        if (p.getFlat() != null) {
            d.setFlatId(p.getFlat().getId());
            d.setFlatNumber(p.getFlat().getFlatNumber());
        }
        d.setReceiptNumber(p.getReceiptNumber());
        d.setAmount(p.getAmount());
        d.setPaymentDate(p.getPaymentDate());
        d.setPaymentType(p.getPaymentType());
        d.setPaymentMethod(p.getPaymentMethod());
        d.setTransactionId(p.getTransactionId());
        d.setStatus(p.getStatus());
        d.setReceiptUrl(p.getReceiptUrl());
        return d;
    }
}
