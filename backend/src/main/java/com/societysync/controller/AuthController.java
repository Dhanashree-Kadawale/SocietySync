package com.societysync.controller;

import com.societysync.dto.*;
import com.societysync.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        AuthResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/resident")
    public ResponseEntity<UserResponseDto> registerResident(@Valid @RequestBody RegisterResidentRequestDto request) {
        UserResponseDto response = authService.registerResident(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/register/staff")
    public ResponseEntity<UserResponseDto> registerStaff(@Valid @RequestBody RegisterStaffRequestDto request) {
        UserResponseDto response = authService.registerStaff(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/register/secretary")
    public ResponseEntity<UserResponseDto> registerSecretary(@Valid @RequestBody RegisterSecretaryRequestDto request) {
        UserResponseDto response = authService.registerSecretary(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponseDto profile = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/societies")
    public ResponseEntity<List<SocietyOptionDto>> getAvailableSocieties() {
        return ResponseEntity.ok(authService.getAvailableSocieties());
    }
}
