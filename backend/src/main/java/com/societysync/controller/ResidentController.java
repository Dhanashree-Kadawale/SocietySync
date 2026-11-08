package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.ResidentDto;
import com.societysync.service.ResidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/residents")
public class ResidentController {

    private final ResidentService residentService;

    public ResidentController(ResidentService residentService) {
        this.residentService = residentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResidentDto>>> getResidents(@RequestParam(required = false) Long societyId) {
        return ResponseEntity.ok(ApiResponse.ok(residentService.getResidents(societyId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResidentDto>> getResidentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(residentService.getResidentById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResidentDto>> createResident(@RequestBody ResidentDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Resident enrolled successfully", residentService.createResident(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResidentDto>> updateResident(@PathVariable Long id, @RequestBody ResidentDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Resident updated successfully", residentService.updateResident(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResident(@PathVariable Long id) {
        residentService.deleteResident(id);
        return ResponseEntity.ok(ApiResponse.ok("Resident deleted successfully", null));
    }
}

