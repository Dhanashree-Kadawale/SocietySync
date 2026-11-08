package com.societysync.service;

import com.societysync.dto.AuthRequest;
import com.societysync.dto.AuthResponse;
import com.societysync.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse getMe(String identity);
}

