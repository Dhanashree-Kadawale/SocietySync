package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.FlatDto;
import com.societysync.service.BuildingFlatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flats")
public class FlatController {

    private final BuildingFlatService buildingFlatService;

    public FlatController(BuildingFlatService buildingFlatService) {
        this.buildingFlatService = buildingFlatService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FlatDto>>> getFlats(@RequestParam(required = false) Long societyId,
                                                               @RequestParam(required = false) Long buildingId) {
        return ResponseEntity.ok(ApiResponse.ok(buildingFlatService.getFlats(societyId, buildingId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlatDto>> getFlatById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(buildingFlatService.getFlatById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FlatDto>> createFlat(@RequestBody FlatDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Flat created successfully", buildingFlatService.createFlat(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FlatDto>> updateFlat(@PathVariable Long id, @RequestBody FlatDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Flat updated successfully", buildingFlatService.updateFlat(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFlat(@PathVariable Long id) {
        buildingFlatService.deleteFlat(id);
        return ResponseEntity.ok(ApiResponse.ok("Flat deleted successfully", null));
    }
}

