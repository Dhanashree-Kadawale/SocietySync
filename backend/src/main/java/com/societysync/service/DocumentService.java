package com.societysync.service;

import com.societysync.dto.SocietyDocumentDto;

import java.util.List;

public interface DocumentService {
    List<SocietyDocumentDto> getDocuments(Long societyId);
    SocietyDocumentDto getDocumentById(Long id);
    SocietyDocumentDto createDocument(SocietyDocumentDto dto);
    void deleteDocument(Long id);
}

