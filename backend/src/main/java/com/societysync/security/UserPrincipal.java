package com.societysync.security;

import com.societysync.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String name;
    private final String email;
    private final String phone;
    private final String password;
    private final Long societyId;
    private final String societyName;
    private final String status;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String name, String email, String phone, String password,
                         Long societyId, String societyName, String status,
                         Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.societyId = societyId;
        this.societyName = societyName;
        this.status = status;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        var authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        Long societyId = user.getSociety() != null ? user.getSociety().getId() : null;
        String societyName = user.getSociety() != null ? user.getSociety().getName() : null;

        return new UserPrincipal(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getPasswordHash(),
                societyId,
                societyName,
                user.getStatus(),
                authorities
        );
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public Long getSocietyId() { return societyId; }
    public String getSocietyName() { return societyName; }
    public String getStatus() { return status; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !"SUSPENDED".equalsIgnoreCase(status) && !"LOCKED_2FA".equalsIgnoreCase(status);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "ACTIVE".equalsIgnoreCase(status);
    }
}
