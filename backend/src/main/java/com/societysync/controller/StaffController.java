package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.StaffDto;
import com.societysync.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffDto>>> getStaff(@RequestParam(required = false) Long societyId) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.getStaff(societyId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffDto>> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(staffService.getStaffById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaffDto>> createStaff(@RequestBody StaffDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Staff member enrolled successfully", staffService.createStaff(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffDto>> updateStaff(@PathVariable Long id, @RequestBody StaffDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Staff member updated successfully", staffService.updateStaff(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.ok("Staff member deleted successfully", null));
    }
}

