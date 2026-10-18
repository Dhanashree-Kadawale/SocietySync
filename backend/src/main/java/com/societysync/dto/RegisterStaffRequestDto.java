package com.societysync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterStaffRequestDto {

    @NotBlank(message = "Staff full legal name is required")
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Email address must be valid")
    private String email;

    @NotBlank(message = "Mobile number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Long societyId;
    private String staffSociety;

    @NotBlank(message = "Employee ID or Vendor Badge is required")
    private String employeeId;

    private String tradeSpecialization = "Electrician";
    private String workType = "Full-Time On-Site Crew";

    public RegisterStaffRequestDto() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getStaffSociety() { return staffSociety; }
    public void setStaffSociety(String staffSociety) { this.staffSociety = staffSociety; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getTradeSpecialization() { return tradeSpecialization; }
    public void setTradeSpecialization(String tradeSpecialization) { this.tradeSpecialization = tradeSpecialization; }

    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }
}
