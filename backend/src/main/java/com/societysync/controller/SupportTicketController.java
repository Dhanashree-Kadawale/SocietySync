package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.SupportTicketDto;
import com.societysync.service.SupportTicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/support-tickets")
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(SupportTicketService supportTicketService) {
        this.supportTicketService = supportTicketService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportTicketDto>>> getTickets(@RequestParam(required = false) Long societyId,
                                                                          @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(supportTicketService.getTickets(societyId, status)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupportTicketDto>> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(supportTicketService.getTicketById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupportTicketDto>> createTicket(@RequestBody SupportTicketDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Support ticket submitted", supportTicketService.createTicket(dto)));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<SupportTicketDto.SupportTicketMessageDto>> addMessage(
            @PathVariable Long id,
            @RequestBody SupportTicketDto.SupportTicketMessageDto msgDto) {
        return ResponseEntity.ok(ApiResponse.ok("Message added", supportTicketService.addMessage(id, msgDto)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SupportTicketDto>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(ApiResponse.ok("Status updated", supportTicketService.updateStatus(id, status)));
    }
}

