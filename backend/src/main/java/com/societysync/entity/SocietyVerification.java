package com.societysync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "society_verifications")
public class SocietyVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id")
    private Society society;

    @Column(name = "society_name", nullable = false, length = 150)
    private String societyName;

    @Column(name = "secretary_name", nullable = false, length = 100)
    private String secretaryName;

    @Column(name = "secretary_email", nullable = false, length = 150)
    private String secretaryEmail;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "registration_number", nullable = false, length = 100)
    private String registrationNumber;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "total_units", nullable = false)
    private Integer totalUnits = 0;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "UNDER_REVIEW";

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public SocietyVerification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Society getSociety() { return society; }
    public void setSociety(Society society) { this.society = society; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
