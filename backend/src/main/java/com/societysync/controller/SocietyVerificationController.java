package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.SocietyVerificationDto;
import com.societysync.service.SocietyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/verifications")
public class SocietyVerificationController {

    private final SocietyService societyService;

    public SocietyVerificationController(SocietyService societyService) {
        this.societyService = societyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SocietyVerificationDto>>> getVerifications(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(societyService.getVerifications(status)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SocietyVerificationDto>> submitVerification(@RequestBody SocietyVerificationDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Verification application submitted", societyService.submitVerification(dto)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SocietyVerificationDto>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String notes = body.get("notes");
        return ResponseEntity.ok(ApiResponse.ok("Verification status updated", societyService.updateVerificationStatus(id, status, notes)));
    }
}

