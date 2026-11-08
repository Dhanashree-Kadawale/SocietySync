package com.societysync.service.impl;

import com.societysync.dto.ResidentDto;
import com.societysync.entity.Flat;
import com.societysync.entity.Resident;
import com.societysync.entity.Role;
import com.societysync.entity.Society;
import com.societysync.entity.User;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.FlatRepository;
import com.societysync.repository.ResidentRepository;
import com.societysync.repository.RoleRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.ResidentService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResidentServiceImpl implements ResidentService {

    private final ResidentRepository residentRepository;
    private final SocietyRepository societyRepository;
    private final FlatRepository flatRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ResidentServiceImpl(ResidentRepository residentRepository,
                               SocietyRepository societyRepository,
                               FlatRepository flatRepository,
                               UserRepository userRepository,
                               RoleRepository roleRepository,
                               PasswordEncoder passwordEncoder) {
        this.residentRepository = residentRepository;
        this.societyRepository = societyRepository;
        this.flatRepository = flatRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResidentDto> getResidents(Long societyId) {
        List<Resident> list = (societyId != null)
                ? residentRepository.findBySocietyId(societyId)
                : residentRepository.findAll();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResidentDto getResidentById(Long id) {
        Resident r = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found: " + id));
        return toDto(r);
    }

    @Override
    @Transactional
    public ResidentDto createResident(ResidentDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        Flat flat = null;
        if (dto.getFlatId() != null) {
            flat = flatRepository.findById(dto.getFlatId()).orElse(null);
        } else if (dto.getFlatNumber() != null && society != null) {
            List<Flat> flats = flatRepository.findBySocietyId(society.getId());
            flat = flats.stream().filter(f -> f.getFlatNumber().equalsIgnoreCase(dto.getFlatNumber())).findFirst().orElse(null);
        }

        // Link or create User
        User user = null;
        if (dto.getEmail() != null) {
            user = userRepository.findByEmail(dto.getEmail()).orElse(null);
            if (user == null) {
                User newUser = new User();
                newUser.setName(dto.getName());
                newUser.setEmail(dto.getEmail());
                newUser.setPhone(dto.getPhone());
                newUser.setSociety(society);
                newUser.setPasswordHash(passwordEncoder.encode("Resident@2026"));
                roleRepository.findByName("ROLE_RESIDENT").ifPresent(role -> newUser.getRoles().add(role));
                user = userRepository.save(newUser);
            }
        }

        Resident r = new Resident();
        r.setSociety(society);
        r.setFlat(flat);
        r.setUser(user);
        r.setName(dto.getName());
        r.setEmail(dto.getEmail());
        r.setPhone(dto.getPhone());
        r.setType(dto.getType() != null ? dto.getType() : "OWNER");
        r.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        r.setJoinDate(dto.getJoinDate() != null ? dto.getJoinDate() : LocalDate.now());
        r.setAvatarUrl(dto.getAvatarUrl());

        if (flat != null) {
            flat.setStatus("OCCUPIED");
            flat.setOwnerName(dto.getName());
            flat.setOwnerPhone(dto.getPhone());
            flatRepository.save(flat);
        }

        return toDto(residentRepository.save(r));
    }

    @Override
    @Transactional
    public ResidentDto updateResident(Long id, ResidentDto dto) {
        Resident r = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found: " + id));

        if (dto.getName() != null) r.setName(dto.getName());
        if (dto.getEmail() != null) r.setEmail(dto.getEmail());
        if (dto.getPhone() != null) r.setPhone(dto.getPhone());
        if (dto.getType() != null) r.setType(dto.getType());
        if (dto.getStatus() != null) r.setStatus(dto.getStatus());
        if (dto.getAvatarUrl() != null) r.setAvatarUrl(dto.getAvatarUrl());
        r.setUpdatedAt(LocalDateTime.now());

        return toDto(residentRepository.save(r));
    }

    @Override
    @Transactional
    public void deleteResident(Long id) {
        if (!residentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resident not found: " + id);
        }
        residentRepository.deleteById(id);
    }

    private ResidentDto toDto(Resident r) {
        ResidentDto d = new ResidentDto();
        d.setId(r.getId());
        if (r.getSociety() != null) d.setSocietyId(r.getSociety().getId());
        if (r.getFlat() != null) {
            d.setFlatId(r.getFlat().getId());
            d.setFlatNumber(r.getFlat().getFlatNumber());
            if (r.getFlat().getBuilding() != null) {
                d.setBuildingName(r.getFlat().getBuilding().getName());
            }
        }
        if (r.getUser() != null) d.setUserId(r.getUser().getId());
        d.setName(r.getName());
        d.setEmail(r.getEmail());
        d.setPhone(r.getPhone());
        d.setType(r.getType());
        d.setStatus(r.getStatus());
        d.setJoinDate(r.getJoinDate());
        d.setAvatarUrl(r.getAvatarUrl());
        return d;
    }
}
