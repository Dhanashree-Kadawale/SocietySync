package com.societysync.service.impl;

import com.societysync.dto.FacilityBookingDto;
import com.societysync.dto.FacilityDto;
import com.societysync.entity.Facility;
import com.societysync.entity.FacilityBooking;
import com.societysync.entity.Flat;
import com.societysync.entity.Resident;
import com.societysync.entity.Society;
import com.societysync.exception.BadRequestException;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.FacilityBookingRepository;
import com.societysync.repository.FacilityRepository;
import com.societysync.repository.ResidentRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.service.FacilityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityServiceImpl implements FacilityService {

    private final FacilityRepository facilityRepository;
    private final FacilityBookingRepository bookingRepository;
    private final SocietyRepository societyRepository;
    private final ResidentRepository residentRepository;

    public FacilityServiceImpl(FacilityRepository facilityRepository,
                               FacilityBookingRepository bookingRepository,
                               SocietyRepository societyRepository,
                               ResidentRepository residentRepository) {
        this.facilityRepository = facilityRepository;
        this.bookingRepository = bookingRepository;
        this.societyRepository = societyRepository;
        this.residentRepository = residentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityDto> getFacilities(Long societyId) {
        List<Facility> list = (societyId != null)
                ? facilityRepository.findBySocietyId(societyId)
                : facilityRepository.findAll();
        return list.stream().map(this::toFacilityDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FacilityDto getFacilityById(Long id) {
        Facility f = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + id));
        return toFacilityDto(f);
    }

    @Override
    @Transactional
    public FacilityDto createFacility(FacilityDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        Facility f = new Facility();
        f.setSociety(society);
        f.setName(dto.getName());
        f.setDescription(dto.getDescription());
        f.setCapacity(dto.getCapacity() != null ? dto.getCapacity() : 20);
        f.setPricePerHour(dto.getPricePerHour() != null ? dto.getPricePerHour() : BigDecimal.ZERO);
        f.setStatus(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE");
        f.setImageUrl(dto.getImageUrl());
        f.setAmenities(dto.getAmenities());

        return toFacilityDto(facilityRepository.save(f));
    }

    @Override
    @Transactional
    public FacilityDto updateFacility(Long id, FacilityDto dto) {
        Facility f = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + id));

        if (dto.getName() != null) f.setName(dto.getName());
        if (dto.getDescription() != null) f.setDescription(dto.getDescription());
        if (dto.getCapacity() != null) f.setCapacity(dto.getCapacity());
        if (dto.getPricePerHour() != null) f.setPricePerHour(dto.getPricePerHour());
        if (dto.getStatus() != null) f.setStatus(dto.getStatus());
        if (dto.getImageUrl() != null) f.setImageUrl(dto.getImageUrl());
        if (dto.getAmenities() != null) f.setAmenities(dto.getAmenities());
        f.setUpdatedAt(LocalDateTime.now());

        return toFacilityDto(facilityRepository.save(f));
    }

    @Override
    @Transactional
    public void deleteFacility(Long id) {
        if (!facilityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Facility not found: " + id);
        }
        facilityRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityBookingDto> getBookings(Long societyId, Long residentId) {
        List<FacilityBooking> list;
        if (residentId != null) {
            list = bookingRepository.findByResidentId(residentId);
        } else if (societyId != null) {
            list = bookingRepository.findBySocietyId(societyId);
        } else {
            list = bookingRepository.findAll();
        }
        return list.stream().map(this::toBookingDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FacilityBookingDto bookFacility(FacilityBookingDto dto) {
        if (dto.getFacilityId() == null || dto.getResidentId() == null ||
                dto.getBookingDate() == null || dto.getStartTime() == null || dto.getEndTime() == null) {
            throw new BadRequestException("Facility, resident, date, and time are required to create a booking");
        }
        Facility facility = facilityRepository.findById(dto.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + dto.getFacilityId()));
        Resident resident = residentRepository.findById(dto.getResidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found: " + dto.getResidentId()));
        Flat flat = resident.getFlat();
        if (flat == null || facility.getSociety() == null || resident.getSociety() == null ||
                !facility.getSociety().getId().equals(resident.getSociety().getId())) {
            throw new BadRequestException("The facility and resident must belong to the same society");
        }
        if (!"AVAILABLE".equalsIgnoreCase(facility.getStatus())) {
            throw new BadRequestException("This facility is not currently available for booking");
        }
        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new BadRequestException("Booking end time must be after the start time");
        }

        FacilityBooking b = new FacilityBooking();
        b.setSociety(resident.getSociety());
        b.setFacility(facility);
        b.setResident(resident);
        b.setFlat(flat);
        b.setBookingDate(dto.getBookingDate());
        b.setStartTime(dto.getStartTime());
        b.setEndTime(dto.getEndTime());
        b.setGuestsCount(dto.getGuestsCount() != null ? dto.getGuestsCount() : 1);
        long durationMinutes = Duration.between(dto.getStartTime(), dto.getEndTime()).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(durationMinutes).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        b.setBookingFee(facility.getPricePerHour().multiply(hours));
        b.setStatus("PENDING_APPROVAL");
        b.setPurpose(dto.getPurpose() != null ? dto.getPurpose() : "Community Activity");
        b.setSpecialRequests(dto.getSpecialRequests());

        return toBookingDto(bookingRepository.save(b));
    }

    @Override
    @Transactional
    public FacilityBookingDto updateBookingStatus(Long id, String status) {
        FacilityBooking b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
        b.setStatus(status);
        b.setUpdatedAt(LocalDateTime.now());
        return toBookingDto(bookingRepository.save(b));
    }

    private FacilityDto toFacilityDto(Facility f) {
        FacilityDto d = new FacilityDto();
        d.setId(f.getId());
        if (f.getSociety() != null) d.setSocietyId(f.getSociety().getId());
        d.setName(f.getName());
        d.setDescription(f.getDescription());
        d.setCapacity(f.getCapacity());
        d.setPricePerHour(f.getPricePerHour());
        d.setStatus(f.getStatus());
        d.setImageUrl(f.getImageUrl());
        d.setAmenities(f.getAmenities());
        return d;
    }

    private FacilityBookingDto toBookingDto(FacilityBooking b) {
        FacilityBookingDto d = new FacilityBookingDto();
        d.setId(b.getId());
        if (b.getSociety() != null) d.setSocietyId(b.getSociety().getId());
        if (b.getFacility() != null) {
            d.setFacilityId(b.getFacility().getId());
            d.setFacilityName(b.getFacility().getName());
        }
        if (b.getResident() != null) {
            d.setResidentId(b.getResident().getId());
            d.setResidentName(b.getResident().getName());
        }
        if (b.getFlat() != null) {
            d.setFlatId(b.getFlat().getId());
            d.setFlatNumber(b.getFlat().getFlatNumber());
        }
        d.setBookingDate(b.getBookingDate());
        d.setStartTime(b.getStartTime());
        d.setEndTime(b.getEndTime());
        d.setGuestsCount(b.getGuestsCount());
        d.setBookingFee(b.getBookingFee());
        d.setStatus(b.getStatus());
        d.setPurpose(b.getPurpose());
        d.setSpecialRequests(b.getSpecialRequests());
        d.setCreatedAt(b.getCreatedAt());
        return d;
    }
}
