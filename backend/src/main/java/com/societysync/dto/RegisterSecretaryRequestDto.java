package com.societysync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterSecretaryRequestDto {

    @NotBlank(message = "Housing society name is required")
    private String societyName;

    @NotBlank(message = "Society registration / RERA number is required")
    private String societyRegNo;

    private String city;
    private String totalUnits = "50 to 150 Units (3-4 Towers)";

    @NotBlank(message = "Secretary full legal name is required")
    private String fullName;

    private String secretaryDesignation = "Society Secretary";

    @NotBlank(message = "Official email address is required")
    @Email(message = "Email address must be valid")
    private String email;

    @NotBlank(message = "Mobile number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    public RegisterSecretaryRequestDto() {}

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public String getSocietyRegNo() { return societyRegNo; }
    public void setSocietyRegNo(String societyRegNo) { this.societyRegNo = societyRegNo; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getTotalUnits() { return totalUnits; }
    public void setTotalUnits(String totalUnits) { this.totalUnits = totalUnits; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSecretaryDesignation() { return secretaryDesignation; }
    public void setSecretaryDesignation(String secretaryDesignation) { this.secretaryDesignation = secretaryDesignation; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
