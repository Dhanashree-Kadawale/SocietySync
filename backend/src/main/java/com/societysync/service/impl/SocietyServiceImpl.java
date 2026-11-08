package com.societysync.service.impl;

import com.societysync.dto.SocietyDto;
import com.societysync.dto.SocietyVerificationDto;
import com.societysync.entity.Society;
import com.societysync.entity.SocietyVerification;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.SocietyVerificationRepository;
import com.societysync.service.SocietyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SocietyServiceImpl implements SocietyService {

    private final SocietyRepository societyRepository;
    private final SocietyVerificationRepository verificationRepository;

    public SocietyServiceImpl(SocietyRepository societyRepository,
                              SocietyVerificationRepository verificationRepository) {
        this.societyRepository = societyRepository;
        this.verificationRepository = verificationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocietyDto> getAllSocieties() {
        return societyRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SocietyDto getSocietyById(Long id) {
        Society society = societyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found with id: " + id));
        return toDto(society);
    }

    @Override
    @Transactional
    public SocietyDto createSociety(SocietyDto dto) {
        Society s = new Society();
        s.setCode(dto.getCode() != null ? dto.getCode() : "SOC-" + (1000 + societyRepository.count() + 1));
        s.setName(dto.getName());
        s.setRegistrationNumber(dto.getRegistrationNumber() != null ? dto.getRegistrationNumber() : "REG/" + System.currentTimeMillis());
        s.setLocation(dto.getLocation() != null ? dto.getLocation() : "Pune, Maharashtra");
        s.setCity(dto.getCity() != null ? dto.getCity() : "Pune");
        s.setState(dto.getState() != null ? dto.getState() : "Maharashtra");
        s.setPostalCode(dto.getPostalCode());
        s.setTotalUnits(dto.getTotalUnits() != null ? dto.getTotalUnits() : 0);
        s.setTotalTowers(dto.getTotalTowers() != null ? dto.getTotalTowers() : 1);
        s.setAdminName(dto.getAdminName());
        s.setAdminEmail(dto.getAdminEmail());
        s.setAdminPhone(dto.getAdminPhone());
        s.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        s.setSubscriptionPlan(dto.getSubscriptionPlan() != null ? dto.getSubscriptionPlan() : "STANDARD");
        s.setMonthlyDuesVolume(dto.getMonthlyDuesVolume() != null ? dto.getMonthlyDuesVolume() : "₹0");
        s.setOnboardedDate(dto.getOnboardedDate() != null ? dto.getOnboardedDate() : LocalDate.now());

        Society saved = societyRepository.save(s);
        return toDto(saved);
    }

    @Override
    @Transactional
    public SocietyDto updateSociety(Long id, SocietyDto dto) {
        Society s = societyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found with id: " + id));

        if (dto.getName() != null) s.setName(dto.getName());
        if (dto.getLocation() != null) s.setLocation(dto.getLocation());
        if (dto.getCity() != null) s.setCity(dto.getCity());
        if (dto.getState() != null) s.setState(dto.getState());
        if (dto.getTotalUnits() != null) s.setTotalUnits(dto.getTotalUnits());
        if (dto.getTotalTowers() != null) s.setTotalTowers(dto.getTotalTowers());
        if (dto.getAdminName() != null) s.setAdminName(dto.getAdminName());
        if (dto.getAdminEmail() != null) s.setAdminEmail(dto.getAdminEmail());
        if (dto.getAdminPhone() != null) s.setAdminPhone(dto.getAdminPhone());
        if (dto.getStatus() != null) s.setStatus(dto.getStatus());
        if (dto.getSubscriptionPlan() != null) s.setSubscriptionPlan(dto.getSubscriptionPlan());
        if (dto.getMonthlyDuesVolume() != null) s.setMonthlyDuesVolume(dto.getMonthlyDuesVolume());
        s.setUpdatedAt(LocalDateTime.now());

        return toDto(societyRepository.save(s));
    }

    @Override
    @Transactional
    public void deleteSociety(Long id) {
        if (!societyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Society not found with id: " + id);
        }
        societyRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocietyVerificationDto> getVerifications(String status) {
        List<SocietyVerification> list = (status != null && !status.isEmpty())
                ? verificationRepository.findByStatus(status)
                : verificationRepository.findAll();
        return list.stream().map(this::toVerificationDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SocietyVerificationDto submitVerification(SocietyVerificationDto dto) {
        SocietyVerification v = new SocietyVerification();
        v.setSocietyName(dto.getSocietyName());
        v.setSecretaryName(dto.getSecretaryName());
        v.setSecretaryEmail(dto.getSecretaryEmail());
        v.setPhone(dto.getPhone());
        v.setRegistrationNumber(dto.getRegistrationNumber());
        v.setCity(dto.getCity());
        v.setTotalUnits(dto.getTotalUnits() != null ? dto.getTotalUnits() : 0);
        v.setStatus("UNDER_REVIEW");
        v.setNotes(dto.getNotes());
        return toVerificationDto(verificationRepository.save(v));
    }

    @Override
    @Transactional
    public SocietyVerificationDto updateVerificationStatus(Long id, String status, String notes) {
        SocietyVerification v = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Verification request not found: " + id));
        v.setStatus(status);
        if (notes != null) v.setNotes(notes);
        v.setUpdatedAt(LocalDateTime.now());
        return toVerificationDto(verificationRepository.save(v));
    }

    private SocietyDto toDto(Society s) {
        SocietyDto d = new SocietyDto();
        d.setId(s.getId());
        d.setCode(s.getCode());
        d.setName(s.getName());
        d.setRegistrationNumber(s.getRegistrationNumber());
        d.setLocation(s.getLocation());
        d.setCity(s.getCity());
        d.setState(s.getState());
        d.setPostalCode(s.getPostalCode());
        d.setTotalUnits(s.getTotalUnits());
        d.setTotalTowers(s.getTotalTowers());
        d.setAdminName(s.getAdminName());
        d.setAdminEmail(s.getAdminEmail());
        d.setAdminPhone(s.getAdminPhone());
        d.setStatus(s.getStatus());
        d.setSubscriptionPlan(s.getSubscriptionPlan());
        d.setMonthlyDuesVolume(s.getMonthlyDuesVolume());
        d.setOnboardedDate(s.getOnboardedDate());
        return d;
    }

    private SocietyVerificationDto toVerificationDto(SocietyVerification v) {
        SocietyVerificationDto d = new SocietyVerificationDto();
        d.setId(v.getId());
        if (v.getSociety() != null) d.setSocietyId(v.getSociety().getId());
        d.setSocietyName(v.getSocietyName());
        d.setSecretaryName(v.getSecretaryName());
        d.setSecretaryEmail(v.getSecretaryEmail());
        d.setPhone(v.getPhone());
        d.setRegistrationNumber(v.getRegistrationNumber());
        d.setCity(v.getCity());
        d.setTotalUnits(v.getTotalUnits());
        d.setStatus(v.getStatus());
        d.setNotes(v.getNotes());
        d.setCreatedAt(v.getCreatedAt());
        return d;
    }
}

