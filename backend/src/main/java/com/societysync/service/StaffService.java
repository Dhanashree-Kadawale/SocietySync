package com.societysync.service;

import com.societysync.dto.StaffDto;

import java.util.List;

public interface StaffService {
    List<StaffDto> getStaff(Long societyId);
    StaffDto getStaffById(Long id);
    StaffDto createStaff(StaffDto dto);
    StaffDto updateStaff(Long id, StaffDto dto);
    void deleteStaff(Long id);
}

