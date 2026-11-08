package com.societysync.service;

import com.societysync.dto.VisitorDto;

import java.util.List;

public interface VisitorService {
    List<VisitorDto> getVisitors(Long societyId, String status);
    VisitorDto getVisitorById(Long id);
    VisitorDto createVisitor(VisitorDto dto);
    VisitorDto updateVisitorStatus(Long id, String status);
    void deleteVisitor(Long id);
}

