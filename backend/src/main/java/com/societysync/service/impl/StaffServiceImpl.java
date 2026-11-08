package com.societysync.service.impl;

import com.societysync.dto.StaffDto;
import com.societysync.entity.Society;
import com.societysync.entity.Staff;
import com.societysync.entity.User;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.RoleRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.StaffRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.StaffService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffServiceImpl(StaffRepository staffRepository,
                            SocietyRepository societyRepository,
                            UserRepository userRepository,
                            RoleRepository roleRepository,
                            PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffDto> getStaff(Long societyId) {
        List<Staff> list = (societyId != null)
                ? staffRepository.findBySocietyId(societyId)
                : staffRepository.findAll();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StaffDto getStaffById(Long id) {
        Staff s = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found: " + id));
        return toDto(s);
    }

    @Override
    @Transactional
    public StaffDto createStaff(StaffDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        User user = null;
        if (dto.getEmail() != null) {
            user = userRepository.findByEmail(dto.getEmail()).orElse(null);
            if (user == null) {
                User newUser = new User();
                newUser.setName(dto.getName());
                newUser.setEmail(dto.getEmail());
                newUser.setPhone(dto.getPhone());
                newUser.setSociety(society);
                newUser.setPasswordHash(passwordEncoder.encode("Staff@2026"));
                roleRepository.findByName("ROLE_MAINTENANCE_STAFF").ifPresent(role -> newUser.getRoles().add(role));
                user = userRepository.save(newUser);
            }
        }

        Staff s = new Staff();
        s.setSociety(society);
        s.setUser(user);
        s.setName(dto.getName());
        s.setRole(dto.getRole() != null ? dto.getRole() : "Technician");
        s.setDepartment(dto.getDepartment() != null ? dto.getDepartment() : "General Maintenance");
        s.setPhone(dto.getPhone());
        s.setEmail(dto.getEmail());
        s.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        s.setAvatarUrl(dto.getAvatarUrl());

        return toDto(staffRepository.save(s));
    }

    @Override
    @Transactional
    public StaffDto updateStaff(Long id, StaffDto dto) {
        Staff s = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found: " + id));

        if (dto.getName() != null) s.setName(dto.getName());
        if (dto.getRole() != null) s.setRole(dto.getRole());
        if (dto.getDepartment() != null) s.setDepartment(dto.getDepartment());
        if (dto.getPhone() != null) s.setPhone(dto.getPhone());
        if (dto.getEmail() != null) s.setEmail(dto.getEmail());
        if (dto.getStatus() != null) s.setStatus(dto.getStatus());
        if (dto.getAvatarUrl() != null) s.setAvatarUrl(dto.getAvatarUrl());
        s.setUpdatedAt(LocalDateTime.now());

        return toDto(staffRepository.save(s));
    }

    @Override
    @Transactional
    public void deleteStaff(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff member not found: " + id);
        }
        staffRepository.deleteById(id);
    }

    private StaffDto toDto(Staff s) {
        StaffDto d = new StaffDto();
        d.setId(s.getId());
        if (s.getSociety() != null) d.setSocietyId(s.getSociety().getId());
        if (s.getUser() != null) d.setUserId(s.getUser().getId());
        d.setName(s.getName());
        d.setRole(s.getRole());
        d.setDepartment(s.getDepartment());
        d.setPhone(s.getPhone());
        d.setEmail(s.getEmail());
        d.setStatus(s.getStatus());
        d.setAvatarUrl(s.getAvatarUrl());
        return d;
    }
}
