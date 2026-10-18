package com.societysync.service;

import com.societysync.dto.UpdateUserRequestDto;
import com.societysync.dto.UserResponseDto;
import com.societysync.security.UserPrincipal;

import java.util.List;

public interface UserService {
    UserResponseDto getUserById(Long id, UserPrincipal currentUser);
    UserResponseDto getUserProfile(String username);
    UserResponseDto updateUserProfile(Long id, UpdateUserRequestDto request, UserPrincipal currentUser);
    List<UserResponseDto> getUsersBySociety(Long societyId, UserPrincipal currentUser);
    UserResponseDto updateUserStatus(Long id, String status, UserPrincipal currentUser);
}
