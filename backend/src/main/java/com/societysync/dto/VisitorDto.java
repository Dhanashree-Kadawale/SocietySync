package com.societysync.dto;

import java.time.LocalDateTime;

public class VisitorDto {
    private Long id;
    private Long societyId;
    private Long flatId;
    private String flatNumber;
    private Long hostResidentId;
    private String hostResidentName;
    private String name;
    private String phone;
    private String purpose;
    private String vehicleNumber;
    private String entryPassCode;
    private String status; // EXPECTED, CHECKED_IN, APPROVED, CHECKED_OUT
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private LocalDateTime expectedVisitAt;
    private LocalDateTime createdAt;

    public VisitorDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public Long getFlatId() { return flatId; }
    public void setFlatId(Long flatId) { this.flatId = flatId; }

    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }

    public Long getHostResidentId() { return hostResidentId; }
    public void setHostResidentId(Long hostResidentId) { this.hostResidentId = hostResidentId; }

    public String getHostResidentName() { return hostResidentName; }
    public void setHostResidentName(String hostResidentName) { this.hostResidentName = hostResidentName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getEntryPassCode() { return entryPassCode; }
    public void setEntryPassCode(String entryPassCode) { this.entryPassCode = entryPassCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public LocalDateTime getExpectedVisitAt() { return expectedVisitAt; }
    public void setExpectedVisitAt(LocalDateTime expectedVisitAt) { this.expectedVisitAt = expectedVisitAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
