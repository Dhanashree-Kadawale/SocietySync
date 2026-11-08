package com.societysync.service.impl;

import com.societysync.dto.SocietyDocumentDto;
import com.societysync.entity.Society;
import com.societysync.entity.SocietyDocument;
import com.societysync.entity.User;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.SocietyDocumentRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.DocumentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final SocietyDocumentRepository documentRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    public DocumentServiceImpl(SocietyDocumentRepository documentRepository,
                               SocietyRepository societyRepository,
                               UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocietyDocumentDto> getDocuments(Long societyId) {
        List<SocietyDocument> list = (societyId != null)
                ? documentRepository.findBySocietyId(societyId)
                : documentRepository.findAll();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SocietyDocumentDto getDocumentById(Long id) {
        SocietyDocument d = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));
        return toDto(d);
    }

    @Override
    @Transactional
    public SocietyDocumentDto createDocument(SocietyDocumentDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        User uploader = null;
        if (dto.getUploadedById() != null) {
            uploader = userRepository.findById(dto.getUploadedById()).orElse(null);
        } else {
            uploader = userRepository.findAll().stream().findFirst().orElse(null);
        }

        SocietyDocument d = new SocietyDocument();
        d.setSociety(society);
        d.setUploadedBy(uploader);
        d.setTitle(dto.getTitle());
        d.setCategory(dto.getCategory() != null ? dto.getCategory() : "GENERAL");
        d.setFileType(dto.getFileType() != null ? dto.getFileType() : "PDF");
        d.setFileSize(dto.getFileSize() != null ? dto.getFileSize() : "1.2 MB");
        d.setFileUrl(dto.getFileUrl() != null ? dto.getFileUrl() : "/docs/document.pdf");
        d.setDescription(dto.getDescription());

        return toDto(documentRepository.save(d));
    }

    @Override
    @Transactional
    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Document not found: " + id);
        }
        documentRepository.deleteById(id);
    }

    private SocietyDocumentDto toDto(SocietyDocument d) {
        SocietyDocumentDto dto = new SocietyDocumentDto();
        dto.setId(d.getId());
        if (d.getSociety() != null) dto.setSocietyId(d.getSociety().getId());
        if (d.getUploadedBy() != null) {
            dto.setUploadedById(d.getUploadedBy().getId());
            dto.setUploadedByName(d.getUploadedBy().getName());
        }
        dto.setTitle(d.getTitle());
        dto.setCategory(d.getCategory());
        dto.setFileType(d.getFileType());
        dto.setFileSize(d.getFileSize());
        dto.setFileUrl(d.getFileUrl());
        dto.setDescription(d.getDescription());
        dto.setCreatedAt(d.getCreatedAt());
        return dto;
    }
}

