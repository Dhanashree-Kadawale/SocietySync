package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.PollDto;
import com.societysync.service.PollService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/polls")
public class PollController {

    private final PollService pollService;

    public PollController(PollService pollService) {
        this.pollService = pollService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PollDto>>> getPolls(@RequestParam(required = false) Long societyId,
                                                               @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(pollService.getPolls(societyId, userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PollDto>> getPollById(@PathVariable Long id, @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(pollService.getPollById(id, userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PollDto>> createPoll(@RequestBody PollDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Poll created successfully", pollService.createPoll(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PollDto>> updatePoll(@PathVariable Long id, @RequestBody PollDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Poll updated successfully", pollService.updatePoll(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePoll(@PathVariable Long id, @RequestParam Long societyId) {
        pollService.deletePoll(id, societyId);
        return ResponseEntity.ok(ApiResponse.ok("Poll deleted successfully", null));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<ApiResponse<PollDto>> vote(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long optionId = body.get("optionId");
        Long userId = body.get("userId");
        return ResponseEntity.ok(ApiResponse.ok("Vote recorded successfully", pollService.vote(id, optionId, userId)));
    }
}
