package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.SocietyDto;
import com.societysync.service.SocietyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/societies")
public class SocietyController {

    private final SocietyService societyService;

    public SocietyController(SocietyService societyService) {
        this.societyService = societyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SocietyDto>>> getAllSocieties() {
        return ResponseEntity.ok(ApiResponse.ok(societyService.getAllSocieties()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SocietyDto>> getSocietyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(societyService.getSocietyById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SocietyDto>> createSociety(@RequestBody SocietyDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Society registered successfully", societyService.createSociety(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SocietyDto>> updateSociety(@PathVariable Long id, @RequestBody SocietyDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Society updated successfully", societyService.updateSociety(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSociety(@PathVariable Long id) {
        societyService.deleteSociety(id);
        return ResponseEntity.ok(ApiResponse.ok("Society deleted successfully", null));
    }
}

