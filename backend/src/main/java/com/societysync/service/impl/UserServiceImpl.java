package com.societysync.service.impl;

import com.societysync.dto.UpdateUserRequestDto;
import com.societysync.dto.UserResponseDto;
import com.societysync.entity.Role;
import com.societysync.entity.User;
import com.societysync.exception.BadRequestException;
import com.societysync.exception.ForbiddenException;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.ResidentRepository;
import com.societysync.repository.UserRepository;
import com.societysync.security.UserPrincipal;
import com.societysync.service.UserService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ResidentRepository residentRepository;

    public UserServiceImpl(UserRepository userRepository, ResidentRepository residentRepository) {
        this.userRepository = userRepository;
        this.residentRepository = residentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id, UserPrincipal currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        validateSocietyAccess(user.getSociety() != null ? user.getSociety().getId() : null, currentUser);
        return mapToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserProfile(String username) {
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhone(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return mapToDto(user);
    }

    @Override
    public UserResponseDto updateUserProfile(Long id, UpdateUserRequestDto request, UserPrincipal currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Must be the user themselves or an administrator
        boolean isSelf = Objects.equals(user.getId(), currentUser.getId());
        boolean isAdmin = isSuperAdmin(currentUser) || isSocietyAdmin(currentUser);

        if (!isSelf && !isAdmin) {
            throw new ForbiddenException("You do not have permission to update this profile");
        }

        validateSocietyAccess(user.getSociety() != null ? user.getSociety().getId() : null, currentUser);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getUsersBySociety(Long societyId, UserPrincipal currentUser) {
        validateSocietyAccess(societyId, currentUser);

        return userRepository.findBySocietyId(societyId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDto updateUserStatus(Long id, String status, UserPrincipal currentUser) {
        if (!isSuperAdmin(currentUser) && !isSocietyAdmin(currentUser)) {
            throw new ForbiddenException("Only administrators can update account status");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        validateSocietyAccess(user.getSociety() != null ? user.getSociety().getId() : null, currentUser);

        String upperStatus = status.trim().toUpperCase();
        if (!List.of("ACTIVE", "PENDING", "SUSPENDED", "LOCKED_2FA").contains(upperStatus)) {
            throw new BadRequestException("Invalid user status: " + status);
        }

        user.setStatus(upperStatus);
        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    private void validateSocietyAccess(Long targetSocietyId, UserPrincipal currentUser) {
        if (isSuperAdmin(currentUser)) {
            return; // Super Admin has global cross-society privileges
        }
        if (currentUser.getSocietyId() == null || !Objects.equals(currentUser.getSocietyId(), targetSocietyId)) {
            throw new ForbiddenException("Access denied: You cannot view or modify data outside your housing society");
        }
    }

    private boolean isSuperAdmin(UserPrincipal principal) {
        return principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_SUPER_ADMIN"));
    }

    private boolean isSocietyAdmin(UserPrincipal principal) {
        return principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_SECRETARY_ADMIN") || a.equals("ROLE_SOCIETY_ADMIN"));
    }

    private UserResponseDto mapToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setTwoFactorEnabled(user.getTwoFactorEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLoginAt(user.getLastLoginAt());

        if (user.getSociety() != null) {
            dto.setSocietyId(user.getSociety().getId());
            dto.setSocietyName(user.getSociety().getName());
        }

        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toSet()));
        }

        residentRepository.findByEmail(user.getEmail()).ifPresent(res -> {
            if (res.getFlat() != null) {
                String buildingName = res.getFlat().getBuilding() != null ? res.getFlat().getBuilding().getName() : "";
                dto.setFlatNumber(buildingName + " " + res.getFlat().getFlatNumber());
            }
        });

        return dto;
    }
}
