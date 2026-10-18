package com.societysync.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "societies")
public class Society {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "registration_number", nullable = false, unique = true, length = 100)
    private String registrationNumber;

    @Column(name = "location", nullable = false, length = 200)
    private String location;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", nullable = false, length = 100)
    private String state = "Maharashtra";

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "total_units", nullable = false)
    private Integer totalUnits = 0;

    @Column(name = "total_towers", nullable = false)
    private Integer totalTowers = 1;

    @Column(name = "admin_name", length = 100)
    private String adminName;

    @Column(name = "admin_email", length = 150)
    private String adminEmail;

    @Column(name = "admin_phone", length = 20)
    private String adminPhone;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(name = "subscription_plan", nullable = false, length = 50)
    private String subscriptionPlan = "STANDARD";

    @Column(name = "monthly_dues_volume", length = 50)
    private String monthlyDuesVolume;

    @Column(name = "onboarded_date")
    private LocalDate onboardedDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Society() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public Integer getTotalUnits() { return totalUnits; }
    public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }

    public Integer getTotalTowers() { return totalTowers; }
    public void setTotalTowers(Integer totalTowers) { this.totalTowers = totalTowers; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getAdminPhone() { return adminPhone; }
    public void setAdminPhone(String adminPhone) { this.adminPhone = adminPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSubscriptionPlan() { return subscriptionPlan; }
    public void setSubscriptionPlan(String subscriptionPlan) { this.subscriptionPlan = subscriptionPlan; }

    public String getMonthlyDuesVolume() { return monthlyDuesVolume; }
    public void setMonthlyDuesVolume(String monthlyDuesVolume) { this.monthlyDuesVolume = monthlyDuesVolume; }

    public LocalDate getOnboardedDate() { return onboardedDate; }
    public void setOnboardedDate(LocalDate onboardedDate) { this.onboardedDate = onboardedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
