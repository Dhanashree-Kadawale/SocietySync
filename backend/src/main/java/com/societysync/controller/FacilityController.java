package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.FacilityDto;
import com.societysync.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacilityDto>>> getFacilities(@RequestParam(required = false) Long societyId) {
        return ResponseEntity.ok(ApiResponse.ok(facilityService.getFacilities(societyId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacilityDto>> getFacilityById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(facilityService.getFacilityById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FacilityDto>> createFacility(@RequestBody FacilityDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Facility created successfully", facilityService.createFacility(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacilityDto>> updateFacility(@PathVariable Long id, @RequestBody FacilityDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Facility updated successfully", facilityService.updateFacility(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.ok(ApiResponse.ok("Facility deleted successfully", null));
    }
}

