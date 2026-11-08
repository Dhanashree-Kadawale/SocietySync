package com.societysync.service;

import com.societysync.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getDashboardStats(Long societyId);
}

