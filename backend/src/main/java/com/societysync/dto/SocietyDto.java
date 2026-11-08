package com.societysync.dto;

import java.time.LocalDate;

public class SocietyDto {
    private Long id;
    private String code;
    private String name;
    private String registrationNumber;
    private String location;
    private String city;
    private String state;
    private String postalCode;
    private Integer totalUnits;
    private Integer totalTowers;
    private String adminName;
    private String adminEmail;
    private String adminPhone;
    private String status;
    private String subscriptionPlan;
    private String monthlyDuesVolume;
    private LocalDate onboardedDate;

    public SocietyDto() {}

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
}

