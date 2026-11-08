package com.societysync.service;

import com.societysync.dto.ComplaintDto;

import java.util.List;

public interface ComplaintService {
    List<ComplaintDto> getComplaints(Long societyId, Long residentId, String status);
    ComplaintDto getComplaintById(Long id);
    ComplaintDto createComplaint(ComplaintDto dto);
    ComplaintDto updateComplaint(Long id, ComplaintDto dto);
    void deleteComplaint(Long id);
}

