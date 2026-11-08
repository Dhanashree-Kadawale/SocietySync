package com.societysync.controller;

import com.societysync.dto.ApiResponse;
import com.societysync.dto.NoticeDto;
import com.societysync.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notices")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoticeDto>>> getNotices(@RequestParam(required = false) Long societyId) {
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getNotices(societyId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoticeDto>> getNoticeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getNoticeById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoticeDto>> createNotice(@RequestBody NoticeDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Notice published successfully", noticeService.createNotice(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NoticeDto>> updateNotice(@PathVariable Long id, @RequestBody NoticeDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Notice updated successfully", noticeService.updateNotice(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.ok("Notice deleted successfully", null));
    }
}

