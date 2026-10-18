package com.societysync.service;

import com.societysync.dto.*;

import java.util.List;

public interface AuthService {
    AuthResponseDto login(LoginRequestDto request);
    UserResponseDto registerResident(RegisterResidentRequestDto request);
    UserResponseDto registerStaff(RegisterStaffRequestDto request);
    UserResponseDto registerSecretary(RegisterSecretaryRequestDto request);
    UserResponseDto getCurrentUser(String username);
    List<SocietyOptionDto> getAvailableSocieties();
}
