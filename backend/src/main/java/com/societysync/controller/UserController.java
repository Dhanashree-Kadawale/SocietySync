package com.societysync.controller;

import com.societysync.dto.UpdateUserRequestDto;
import com.societysync.dto.UserResponseDto;
import com.societysync.security.UserPrincipal;
import com.societysync.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id,
                                                       @AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponseDto user = userService.getUserById(id, currentUser);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUserProfile(@PathVariable Long id,
                                                             @RequestBody UpdateUserRequestDto request,
                                                             @AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponseDto updated = userService.updateUserProfile(id, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<UserResponseDto>> getUsersBySociety(@PathVariable Long societyId,
                                                                   @AuthenticationPrincipal UserPrincipal currentUser) {
        List<UserResponseDto> users = userService.getUsersBySociety(societyId, currentUser);
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECRETARY_ADMIN', 'SOCIETY_ADMIN')")
    public ResponseEntity<UserResponseDto> updateUserStatus(@PathVariable Long id,
                                                            @RequestBody Map<String, String> statusPayload,
                                                            @AuthenticationPrincipal UserPrincipal currentUser) {
        String status = statusPayload.get("status");
        UserResponseDto updated = userService.updateUserStatus(id, status, currentUser);
        return ResponseEntity.ok(updated);
    }
}
