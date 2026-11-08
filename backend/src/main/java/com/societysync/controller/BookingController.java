package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.FacilityBookingDto;
import com.societysync.service.FacilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final FacilityService facilityService;

    public BookingController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacilityBookingDto>>> getBookings(@RequestParam(required = false) Long societyId,
                                                                             @RequestParam(required = false) Long residentId) {
        return ResponseEntity.ok(ApiResponse.ok(facilityService.getBookings(societyId, residentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FacilityBookingDto>> bookFacility(@RequestBody FacilityBookingDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Facility booked successfully", facilityService.bookFacility(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacilityBookingDto>> updateBooking(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status") != null ? body.get("status") : "CONFIRMED";
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated", facilityService.updateBookingStatus(id, status)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FacilityBookingDto>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated", facilityService.updateBookingStatus(id, status)));
    }
}

