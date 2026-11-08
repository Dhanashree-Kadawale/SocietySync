package com.societysync.service.impl;

import com.societysync.dto.ComplaintDto;
import com.societysync.entity.Complaint;
import com.societysync.entity.Flat;
import com.societysync.entity.Resident;
import com.societysync.entity.Society;
import com.societysync.entity.Staff;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.ComplaintRepository;
import com.societysync.repository.FlatRepository;
import com.societysync.repository.ResidentRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.StaffRepository;
import com.societysync.service.ComplaintService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final SocietyRepository societyRepository;
    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;
    private final StaffRepository staffRepository;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository,
                                SocietyRepository societyRepository,
                                FlatRepository flatRepository,
                                ResidentRepository residentRepository,
                                StaffRepository staffRepository) {
        this.complaintRepository = complaintRepository;
        this.societyRepository = societyRepository;
        this.flatRepository = flatRepository;
        this.residentRepository = residentRepository;
        this.staffRepository = staffRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintDto> getComplaints(Long societyId, Long residentId, String status) {
        List<Complaint> list;
        if (residentId != null) {
            list = complaintRepository.findByResidentId(residentId);
        } else if (societyId != null && status != null && !status.isEmpty()) {
            list = complaintRepository.findBySocietyIdAndStatus(societyId, status);
        } else if (societyId != null) {
            list = complaintRepository.findBySocietyId(societyId);
        } else {
            list = complaintRepository.findAll();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintDto getComplaintById(Long id) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        return toDto(c);
    }

    @Override
    @Transactional
    public ComplaintDto createComplaint(ComplaintDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        Resident resident = null;
        if (dto.getResidentId() != null) {
            resident = residentRepository.findById(dto.getResidentId()).orElse(null);
        } else if (dto.getResidentName() != null) {
            resident = residentRepository.findAll().stream()
                    .filter(r -> r.getName().equalsIgnoreCase(dto.getResidentName()))
                    .findFirst().orElse(null);
        }

        Flat flat = null;
        if (dto.getFlatId() != null) {
            flat = flatRepository.findById(dto.getFlatId()).orElse(null);
        } else if (dto.getFlatNumber() != null && society != null) {
            flat = flatRepository.findBySocietyId(society.getId()).stream()
                    .filter(f -> f.getFlatNumber().equalsIgnoreCase(dto.getFlatNumber()))
                    .findFirst().orElse(null);
        } else if (dto.getFlatNumber() != null) {
            flat = flatRepository.findAll().stream()
                    .filter(f -> f.getFlatNumber().equalsIgnoreCase(dto.getFlatNumber()))
                    .findFirst().orElse(null);
        } else if (resident != null && resident.getFlat() != null) {
            flat = resident.getFlat();
        }

        if (flat == null && society != null) {
            flat = flatRepository.findBySocietyId(society.getId()).stream().findFirst().orElse(null);
        }
        if (resident == null && flat != null) {
            resident = residentRepository.findByFlatId(flat.getId()).orElse(null);
        }
        if (resident == null) {
            resident = residentRepository.findAll().stream().findFirst().orElse(null);
        }

        Staff staff = null;
        if (dto.getAssignedStaffId() != null) {
            staff = staffRepository.findById(dto.getAssignedStaffId()).orElse(null);
        } else if (dto.getAssignedStaffName() != null) {
            staff = staffRepository.findAll().stream()
                    .filter(s -> s.getName().equalsIgnoreCase(dto.getAssignedStaffName()))
                    .findFirst().orElse(null);
        }

        Complaint c = new Complaint();
        c.setSociety(society);
        c.setFlat(flat);
        c.setResident(resident);
        c.setAssignedStaff(staff);
        c.setTitle(dto.getTitle());
        c.setDescription(dto.getDescription());
        c.setCategory(dto.getCategory() != null ? dto.getCategory() : "General");
        c.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        c.setStatus(dto.getStatus() != null ? dto.getStatus() : "OPEN");

        return toDto(complaintRepository.save(c));
    }

    @Override
    @Transactional
    public ComplaintDto updateComplaint(Long id, ComplaintDto dto) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));

        if (dto.getTitle() != null) c.setTitle(dto.getTitle());
        if (dto.getDescription() != null) c.setDescription(dto.getDescription());
        if (dto.getCategory() != null) c.setCategory(dto.getCategory());
        if (dto.getPriority() != null) c.setPriority(dto.getPriority());
        if (dto.getStatus() != null) {
            c.setStatus(dto.getStatus());
            if ("RESOLVED".equalsIgnoreCase(dto.getStatus()) || "CLOSED".equalsIgnoreCase(dto.getStatus())) {
                c.setResolvedAt(LocalDateTime.now());
            }
        }
        if (dto.getResolutionNotes() != null) c.setResolutionNotes(dto.getResolutionNotes());
        if (dto.getAssignedStaffId() != null) {
            staffRepository.findById(dto.getAssignedStaffId()).ifPresent(c::setAssignedStaff);
        } else if (dto.getAssignedStaffName() != null) {
            staffRepository.findAll().stream()
                    .filter(s -> s.getName().equalsIgnoreCase(dto.getAssignedStaffName()))
                    .findFirst().ifPresent(c::setAssignedStaff);
        }
        c.setUpdatedAt(LocalDateTime.now());

        return toDto(complaintRepository.save(c));
    }

    @Override
    @Transactional
    public void deleteComplaint(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new ResourceNotFoundException("Complaint not found: " + id);
        }
        complaintRepository.deleteById(id);
    }

    private ComplaintDto toDto(Complaint c) {
        ComplaintDto d = new ComplaintDto();
        d.setId(c.getId());
        if (c.getSociety() != null) d.setSocietyId(c.getSociety().getId());
        if (c.getFlat() != null) {
            d.setFlatId(c.getFlat().getId());
            d.setFlatNumber(c.getFlat().getFlatNumber());
        }
        if (c.getResident() != null) {
            d.setResidentId(c.getResident().getId());
            d.setResidentName(c.getResident().getName());
        }
        if (c.getAssignedStaff() != null) {
            d.setAssignedStaffId(c.getAssignedStaff().getId());
            d.setAssignedStaffName(c.getAssignedStaff().getName());
        }
        d.setTitle(c.getTitle());
        d.setDescription(c.getDescription());
        d.setCategory(c.getCategory());
        d.setPriority(c.getPriority());
        d.setStatus(c.getStatus());
        d.setResolutionNotes(c.getResolutionNotes());
        d.setResolvedAt(c.getResolvedAt());
        d.setCreatedAt(c.getCreatedAt());
        return d;
    }
}

