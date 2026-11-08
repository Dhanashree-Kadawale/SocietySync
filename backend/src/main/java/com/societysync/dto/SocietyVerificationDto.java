package com.societysync.dto;

import java.time.LocalDateTime;

public class SocietyVerificationDto {
    private Long id;
    private Long societyId;
    private String societyName;
    private String secretaryName;
    private String secretaryEmail;
    private String phone;
    private String registrationNumber;
    private String city;
    private Integer totalUnits;
    private String status;
    private String notes;
    private LocalDateTime createdAt;

    public SocietyVerificationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public String getSecretaryName() { return secretaryName; }
    public void setSecretaryName(String secretaryName) { this.secretaryName = secretaryName; }

    public String getSecretaryEmail() { return secretaryEmail; }
    public void setSecretaryEmail(String secretaryEmail) { this.secretaryEmail = secretaryEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Integer getTotalUnits() { return totalUnits; }
    public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

