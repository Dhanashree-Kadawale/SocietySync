package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.SocietyDocumentDto;
import com.societysync.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SocietyDocumentDto>>> getDocuments(@RequestParam(required = false) Long societyId) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.getDocuments(societyId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SocietyDocumentDto>> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.getDocumentById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SocietyDocumentDto>> createDocument(@RequestBody SocietyDocumentDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Document uploaded successfully", documentService.createDocument(dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok(ApiResponse.ok("Document deleted successfully", null));
    }
}

