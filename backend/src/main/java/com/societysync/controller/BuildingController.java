package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.BuildingDto;
import com.societysync.service.BuildingFlatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
public class BuildingController {

    private final BuildingFlatService buildingFlatService;

    public BuildingController(BuildingFlatService buildingFlatService) {
        this.buildingFlatService = buildingFlatService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BuildingDto>>> getBuildings(@RequestParam(required = false) Long societyId) {
        return ResponseEntity.ok(ApiResponse.ok(buildingFlatService.getBuildings(societyId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BuildingDto>> createBuilding(@RequestBody BuildingDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Building added successfully", buildingFlatService.createBuilding(dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBuilding(@PathVariable Long id) {
        buildingFlatService.deleteBuilding(id);
        return ResponseEntity.ok(ApiResponse.ok("Building deleted successfully", null));
    }
}

