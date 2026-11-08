package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.ComplaintDto;
import com.societysync.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getComplaints(@RequestParam(required = false) Long societyId,
                                                                         @RequestParam(required = false) Long residentId,
                                                                         @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.getComplaints(societyId, residentId, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintDto>> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.getComplaintById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintDto>> createComplaint(@RequestBody ComplaintDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Complaint registered successfully", complaintService.createComplaint(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintDto>> updateComplaint(@PathVariable Long id, @RequestBody ComplaintDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Complaint updated successfully", complaintService.updateComplaint(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.ok("Complaint deleted successfully", null));
    }
}

