package com.societysync.service.impl;

import com.societysync.dto.*;
import com.societysync.entity.*;
import com.societysync.exception.BadRequestException;
import com.societysync.exception.DuplicateResourceException;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.exception.UnauthorizedException;
import com.societysync.repository.*;
import com.societysync.security.JwtTokenProvider;
import com.societysync.security.UserPrincipal;
import com.societysync.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SocietyRepository societyRepository;
    private final BuildingRepository buildingRepository;
    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;
    private final StaffRepository staffRepository;
    private final SocietyVerificationRepository verificationRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           PasswordEncoder passwordEncoder,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           SocietyRepository societyRepository,
                           BuildingRepository buildingRepository,
                           FlatRepository flatRepository,
                           ResidentRepository residentRepository,
                           StaffRepository staffRepository,
                           SocietyVerificationRepository verificationRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.societyRepository = societyRepository;
        this.buildingRepository = buildingRepository;
        this.flatRepository = flatRepository;
        this.residentRepository = residentRepository;
        this.staffRepository = staffRepository;
        this.verificationRepository = verificationRepository;
    }

    @Override
    public AuthResponseDto login(LoginRequestDto request) {
        String identity = request.getIdentity().trim();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identity, request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

            String token = tokenProvider.generateToken(principal);

            // Update user last login timestamp
            userRepository.findById(principal.getId()).ifPresent(u -> {
                u.setLastLoginAt(LocalDateTime.now());
                userRepository.save(u);
            });

            User user = userRepository.findById(principal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            UserResponseDto userDto = mapToUserResponseDto(user);
            return new AuthResponseDto(token, tokenProvider.getExpirationMs(), userDto);
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email/phone or password");
        }
    }

    @Override
    public UserResponseDto registerResident(RegisterResidentRequestDto request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email " + email + " already exists");
        }

        Society society = resolveSociety(request.getSocietyId(), request.getSocietyName());

        Role residentRole = roleRepository.findByName("ROLE_RESIDENT")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_RESIDENT not found"));

        User user = new User();
        user.setName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setSociety(society);
        user.setStatus("ACTIVE"); // Active account, allotment verified by society
        user.setRoles(new HashSet<>(Collections.singletonList(residentRole)));

        User savedUser = userRepository.save(user);

        // Resolve or create building
        String wingName = (request.getWing() != null && !request.getWing().isBlank())
                ? request.getWing().trim() : "Tower A";
        Building building = buildingRepository.findBySocietyIdAndName(society.getId(), wingName)
                .orElseGet(() -> {
                    Building b = new Building();
                    b.setSociety(society);
                    b.setName(wingName);
                    b.setTotalFloors(10);
                    return buildingRepository.save(b);
                });

        // Resolve or create flat
        String flatNum = request.getFlatNumber().trim();
        Flat flat = flatRepository.findByBuildingIdAndFlatNumber(building.getId(), flatNum)
                .orElseGet(() -> {
                    Flat f = new Flat();
                    f.setSociety(society);
                    f.setBuilding(building);
                    f.setFlatNumber(flatNum);
                    f.setStatus("OCCUPIED");
                    f.setOwnerName(request.getFullName().trim());
                    f.setOwnerPhone(request.getPhone().trim());
                    return flatRepository.save(f);
                });

        // Create resident record
        Resident resident = new Resident();
        resident.setSociety(society);
        resident.setFlat(flat);
        resident.setUser(savedUser);
        resident.setName(request.getFullName().trim());
        resident.setEmail(email);
        resident.setPhone(request.getPhone().trim());
        resident.setType("Tenant".equalsIgnoreCase(request.getResidentType()) ? "TENANT" : "OWNER");
        resident.setStatus("ACTIVE");
        resident.setJoinDate(LocalDate.now());
        residentRepository.save(resident);

        UserResponseDto dto = mapToUserResponseDto(savedUser);
        dto.setFlatNumber(building.getName() + " - " + flat.getFlatNumber());
        return dto;
    }

    @Override
    public UserResponseDto registerStaff(RegisterStaffRequestDto request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email " + email + " already exists");
        }

        Society society = resolveSociety(request.getSocietyId(), request.getStaffSociety());

        Role staffRole = roleRepository.findByName("ROLE_MAINTENANCE_STAFF")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_MAINTENANCE_STAFF not found"));

        User user = new User();
        user.setName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setSociety(society);
        // Public crew registration is PENDING until approved by Secretary Admin
        user.setStatus("PENDING");
        user.setRoles(new HashSet<>(Collections.singletonList(staffRole)));

        User savedUser = userRepository.save(user);

        // Create staff record
        Staff staff = new Staff();
        staff.setSociety(society);
        staff.setUser(savedUser);
        staff.setName(request.getFullName().trim());
        staff.setPhone(request.getPhone().trim());
        staff.setEmail(email);
        staff.setRole(request.getTradeSpecialization());
        staff.setDepartment(request.getTradeSpecialization() + " (" + request.getWorkType() + ")");
        staff.setStatus("PENDING");
        staffRepository.save(staff);

        return mapToUserResponseDto(savedUser);
    }

    @Override
    public UserResponseDto registerSecretary(RegisterSecretaryRequestDto request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email " + email + " already exists");
        }

        // Security rule: Never grant immediate active administrative control to a public onboarding request.
        // Create an official verification request reviewed by Super Admin.
        SocietyVerification verification = new SocietyVerification();
        verification.setSocietyName(request.getSocietyName().trim());
        verification.setSecretaryName(request.getFullName().trim());
        verification.setSecretaryEmail(email);
        verification.setPhone(request.getPhone().trim());
        verification.setRegistrationNumber(request.getSocietyRegNo().trim());
        verification.setCity(request.getCity() != null ? request.getCity().trim() : "Pune");
        verification.setStatus("UNDER_REVIEW");
        verification.setNotes("Self-service onboarding registration. Designation: " + request.getSecretaryDesignation());
        verificationRepository.save(verification);

        Role secretaryRole = roleRepository.findByName("ROLE_SECRETARY_ADMIN")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_SECRETARY_ADMIN not found"));

        User user = new User();
        user.setName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus("PENDING"); // Pending Super Admin verification before primary database activation
        user.setRoles(new HashSet<>(Collections.singletonList(secretaryRole)));

        User savedUser = userRepository.save(user);
        return mapToUserResponseDto(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(String username) {
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhone(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return mapToUserResponseDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocietyOptionDto> getAvailableSocieties() {
        return societyRepository.findAll().stream()
                .map(s -> new SocietyOptionDto(s.getId(), s.getCode(), s.getName(), s.getCity()))
                .collect(Collectors.toList());
    }

    private Society resolveSociety(Long societyId, String societyName) {
        if (societyId != null) {
            return societyRepository.findById(societyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Society with ID " + societyId + " not found"));
        }
        if (societyName != null && !societyName.isBlank()) {
            return societyRepository.findAll().stream()
                    .filter(s -> s.getName().toLowerCase().contains(societyName.toLowerCase().trim()))
                    .findFirst()
                    .orElseGet(() -> societyRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new ResourceNotFoundException("No society available")));
        }
        return societyRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No active society found"));
    }

    public UserResponseDto mapToUserResponseDto(User user) {
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

        // Attempt to find flat number if resident
        residentRepository.findByEmail(user.getEmail()).ifPresent(res -> {
            if (res.getFlat() != null) {
                String wing = res.getFlat().getBuilding() != null ? res.getFlat().getBuilding().getName() : "";
                dto.setFlatNumber(wing + " " + res.getFlat().getFlatNumber());
            }
        });

        return dto;
    }
}
