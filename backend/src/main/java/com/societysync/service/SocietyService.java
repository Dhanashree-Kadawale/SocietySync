package com.societysync.service;

import com.societysync.dto.SocietyDto;
import com.societysync.dto.SocietyVerificationDto;

import java.util.List;

public interface SocietyService {
    List<SocietyDto> getAllSocieties();
    SocietyDto getSocietyById(Long id);
    SocietyDto createSociety(SocietyDto dto);
    SocietyDto updateSociety(Long id, SocietyDto dto);
    void deleteSociety(Long id);

    List<SocietyVerificationDto> getVerifications(String status);
    SocietyVerificationDto submitVerification(SocietyVerificationDto dto);
    SocietyVerificationDto updateVerificationStatus(Long id, String status, String notes);
}

