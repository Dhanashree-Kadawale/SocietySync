package com.societysync.service;

import com.societysync.dto.FacilityBookingDto;
import com.societysync.dto.FacilityDto;

import java.util.List;

public interface FacilityService {
    List<FacilityDto> getFacilities(Long societyId);
    FacilityDto getFacilityById(Long id);
    FacilityDto createFacility(FacilityDto dto);
    FacilityDto updateFacility(Long id, FacilityDto dto);
    void deleteFacility(Long id);

    List<FacilityBookingDto> getBookings(Long societyId, Long residentId);
    FacilityBookingDto bookFacility(FacilityBookingDto dto);
    FacilityBookingDto updateBookingStatus(Long id, String status);
}

