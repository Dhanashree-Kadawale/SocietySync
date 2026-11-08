package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.DashboardStatsDto;
import com.societysync.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats(@RequestParam(required = false) Long societyId) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getDashboardStats(societyId)));
    }
}

