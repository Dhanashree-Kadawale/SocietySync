package com.societysync.service;

import com.societysync.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    List<NotificationDto> getUserNotifications(Long userId);
    void markAsRead(Long id);
    void markAllAsRead(Long userId);
    NotificationDto sendNotification(NotificationDto dto);
}

