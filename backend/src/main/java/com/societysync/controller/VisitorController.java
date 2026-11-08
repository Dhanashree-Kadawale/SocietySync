package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.VisitorDto;
import com.societysync.service.VisitorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/visitors")
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VisitorDto>>> getVisitors(@RequestParam(required = false) Long societyId,
                                                                     @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(visitorService.getVisitors(societyId, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VisitorDto>> getVisitorById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(visitorService.getVisitorById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VisitorDto>> createVisitor(@RequestBody VisitorDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Visitor registered successfully", visitorService.createVisitor(dto)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<VisitorDto>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.ok("Visitor status updated", visitorService.updateVisitorStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVisitor(@PathVariable Long id) {
        visitorService.deleteVisitor(id);
        return ResponseEntity.ok(ApiResponse.ok("Visitor record deleted", null));
    }
}

