package com.societysync.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String role; // Resident, Secretary Admin
    private Long societyId;
    private String societyName;
    private String flatNumber;
    private String buildingName;

    private String societyRegNo;
    private String city;
    private String totalUnits;
    private String staffSpecialization;
    private String employeeId;
    private String residentType;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public String getSocietyRegNo() { return societyRegNo; }
    public void setSocietyRegNo(String societyRegNo) { this.societyRegNo = societyRegNo; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getTotalUnits() { return totalUnits; }
    public void setTotalUnits(String totalUnits) { this.totalUnits = totalUnits; }

    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }

    public String getStaffSpecialization() { return staffSpecialization; }
    public void setStaffSpecialization(String staffSpecialization) { this.staffSpecialization = staffSpecialization; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getResidentType() { return residentType; }
    public void setResidentType(String residentType) { this.residentType = residentType; }
}

