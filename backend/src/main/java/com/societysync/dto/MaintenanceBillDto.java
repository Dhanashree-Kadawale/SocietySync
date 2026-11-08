package com.societysync.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MaintenanceBillDto {
    private Long id;
    private Long societyId;
    private Long flatId;
    private String flatNumber;
    private Long residentId;
    private String residentName;
    private String billNumber;
    private String billingMonth;
    private Integer billingYear;
    private BigDecimal baseAmount;
    private BigDecimal sinkingFund;
    private BigDecimal waterCharges;
    private BigDecimal parkingCharges;
    private BigDecimal penaltyAmount;
    private BigDecimal totalAmount;
    private String status; // PAID, UNPAID, OVERDUE
    private LocalDate dueDate;
    private LocalDate issuedDate;
    private LocalDate paidDate;
    private String paymentMode;
    private String receiptNumber;

    public MaintenanceBillDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public Long getFlatId() { return flatId; }
    public void setFlatId(Long flatId) { this.flatId = flatId; }

    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }

    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }

    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    public String getBillingMonth() { return billingMonth; }
    public void setBillingMonth(String billingMonth) { this.billingMonth = billingMonth; }

    public Integer getBillingYear() { return billingYear; }
    public void setBillingYear(Integer billingYear) { this.billingYear = billingYear; }

    public BigDecimal getBaseAmount() { return baseAmount; }
    public void setBaseAmount(BigDecimal baseAmount) { this.baseAmount = baseAmount; }

    public BigDecimal getSinkingFund() { return sinkingFund; }
    public void setSinkingFund(BigDecimal sinkingFund) { this.sinkingFund = sinkingFund; }

    public BigDecimal getWaterCharges() { return waterCharges; }
    public void setWaterCharges(BigDecimal waterCharges) { this.waterCharges = waterCharges; }

    public BigDecimal getParkingCharges() { return parkingCharges; }
    public void setParkingCharges(BigDecimal parkingCharges) { this.parkingCharges = parkingCharges; }

    public BigDecimal getPenaltyAmount() { return penaltyAmount; }
    public void setPenaltyAmount(BigDecimal penaltyAmount) { this.penaltyAmount = penaltyAmount; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
}

