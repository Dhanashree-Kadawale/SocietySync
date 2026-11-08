package com.societysync.service;

import com.societysync.dto.ResidentDto;

import java.util.List;

public interface ResidentService {
    List<ResidentDto> getResidents(Long societyId);
    ResidentDto getResidentById(Long id);
    ResidentDto createResident(ResidentDto dto);
    ResidentDto updateResident(Long id, ResidentDto dto);
    void deleteResident(Long id);
}

