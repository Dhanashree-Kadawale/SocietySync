package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        return ResponseEntity.ok(ApiResponse.ok("SocietySync API is running healthy", Map.of(
                "status", "UP",
                "database", "CONNECTED (MySQL 8.0)",
                "service", "societysync-backend",
                "timestamp", System.currentTimeMillis()
        )));
    }
}

