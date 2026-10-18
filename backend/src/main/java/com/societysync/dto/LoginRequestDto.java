package com.societysync.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDto {

    @NotBlank(message = "Identity (email or mobile number) is required")
    private String identity;

    @NotBlank(message = "Password is required")
    private String password;

    private String role;
    private Boolean rememberMe = false;

    public LoginRequestDto() {}

    public LoginRequestDto(String identity, String password) {
        this.identity = identity;
        this.password = password;
    }

    public String getIdentity() { return identity; }
    public void setIdentity(String identity) { this.identity = identity; }

    public String getEmail() { return identity; }
    public void setEmail(String email) {
        if (this.identity == null || this.identity.isBlank()) {
            this.identity = email;
        }
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getRememberMe() { return rememberMe; }
    public void setRememberMe(Boolean rememberMe) { this.rememberMe = rememberMe; }
}
