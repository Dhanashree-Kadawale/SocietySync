package com.societysync.service.impl;

import com.societysync.dto.VisitorDto;
import com.societysync.entity.Flat;
import com.societysync.entity.Resident;
import com.societysync.entity.Society;
import com.societysync.entity.Visitor;
import com.societysync.exception.BadRequestException;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.FlatRepository;
import com.societysync.repository.ResidentRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.VisitorRepository;
import com.societysync.service.VisitorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VisitorServiceImpl implements VisitorService {

    private final VisitorRepository visitorRepository;
    private final SocietyRepository societyRepository;
    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;

    public VisitorServiceImpl(VisitorRepository visitorRepository,
                              SocietyRepository societyRepository,
                              FlatRepository flatRepository,
                              ResidentRepository residentRepository) {
        this.visitorRepository = visitorRepository;
        this.societyRepository = societyRepository;
        this.flatRepository = flatRepository;
        this.residentRepository = residentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitorDto> getVisitors(Long societyId, String status) {
        List<Visitor> list;
        if (societyId != null && status != null && !status.isEmpty()) {
            list = visitorRepository.findBySocietyIdAndStatus(societyId, status);
        } else if (societyId != null) {
            list = visitorRepository.findBySocietyId(societyId);
        } else {
            list = visitorRepository.findAll();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VisitorDto getVisitorById(Long id) {
        Visitor v = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor not found: " + id));
        return toDto(v);
    }

    @Override
    @Transactional
    public VisitorDto createVisitor(VisitorDto dto) {
        if (dto.getSocietyId() == null || dto.getHostResidentId() == null ||
                dto.getFlatNumber() == null || dto.getFlatNumber().isBlank()) {
            throw new BadRequestException("Society, host resident, and flat are required to register a visitor");
        }
        Society society = societyRepository.findById(dto.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + dto.getSocietyId()));
        Resident host = residentRepository.findById(dto.getHostResidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found: " + dto.getHostResidentId()));
        Flat flat = flatRepository.findBySocietyId(society.getId()).stream()
                .filter(candidate -> candidate.getFlatNumber().equalsIgnoreCase(dto.getFlatNumber()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found in this society: " + dto.getFlatNumber()));
        if (host.getSociety() == null || !host.getSociety().getId().equals(society.getId()) ||
                host.getFlat() == null || !host.getFlat().getId().equals(flat.getId())) {
            throw new BadRequestException("The host resident and flat must belong to the selected society");
        }
        if (dto.getName() == null || dto.getName().isBlank() || dto.getPhone() == null || dto.getPhone().isBlank()) {
            throw new BadRequestException("Visitor name and phone are required");
        }

        Visitor v = new Visitor();
        v.setSociety(society);
        v.setFlat(flat);
        v.setHostResident(host);
        v.setName(dto.getName());
        v.setPhone(dto.getPhone());
        v.setPurpose(dto.getPurpose() != null ? dto.getPurpose() : "Personal Visit");
        v.setVehicleNumber(dto.getVehicleNumber());
        v.setEntryPassCode(dto.getEntryPassCode() != null ? dto.getEntryPassCode() : "PASS-" + (1000 + (int)(Math.random() * 9000)));
        v.setStatus(dto.getStatus() != null ? dto.getStatus() : "EXPECTED");
        v.setExpectedVisitAt(dto.getExpectedVisitAt());

        if ("CHECKED_IN".equalsIgnoreCase(v.getStatus())) {
            v.setCheckInTime(LocalDateTime.now());
        }

        return toDto(visitorRepository.save(v));
    }

    @Override
    @Transactional
    public VisitorDto updateVisitorStatus(Long id, String status) {
        Visitor v = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor not found: " + id));
        v.setStatus(status);
        if ("CHECKED_IN".equalsIgnoreCase(status) && v.getCheckInTime() == null) {
            v.setCheckInTime(LocalDateTime.now());
        } else if ("CHECKED_OUT".equalsIgnoreCase(status)) {
            v.setCheckOutTime(LocalDateTime.now());
        }
        v.setUpdatedAt(LocalDateTime.now());
        return toDto(visitorRepository.save(v));
    }

    @Override
    @Transactional
    public void deleteVisitor(Long id) {
        if (!visitorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Visitor not found: " + id);
        }
        visitorRepository.deleteById(id);
    }

    private VisitorDto toDto(Visitor v) {
        VisitorDto d = new VisitorDto();
        d.setId(v.getId());
        if (v.getSociety() != null) d.setSocietyId(v.getSociety().getId());
        if (v.getFlat() != null) {
            d.setFlatId(v.getFlat().getId());
            d.setFlatNumber(v.getFlat().getFlatNumber());
        }
        if (v.getHostResident() != null) {
            d.setHostResidentId(v.getHostResident().getId());
            d.setHostResidentName(v.getHostResident().getName());
        }
        d.setName(v.getName());
        d.setPhone(v.getPhone());
        d.setPurpose(v.getPurpose());
        d.setVehicleNumber(v.getVehicleNumber());
        d.setEntryPassCode(v.getEntryPassCode());
        d.setStatus(v.getStatus());
        d.setCheckInTime(v.getCheckInTime());
        d.setCheckOutTime(v.getCheckOutTime());
        d.setExpectedVisitAt(v.getExpectedVisitAt());
        d.setCreatedAt(v.getCreatedAt());
        return d;
    }
}
