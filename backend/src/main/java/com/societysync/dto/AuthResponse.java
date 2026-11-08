package com.societysync.dto;

public class AuthResponse {
    private String id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Long residentId;
    private String flat;
    private String role;
    private Long societyId;
    private String societyName;
    private String token;

    public AuthResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }

    public String getFlat() { return flat; }
    public void setFlat(String flat) { this.flat = flat; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
