package com.societysync.service.impl;

import com.societysync.dto.NotificationDto;
import com.societysync.entity.Notification;
import com.societysync.entity.Society;
import com.societysync.entity.User;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.NotificationRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   SocietyRepository societyRepository,
                                   UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(Long userId) {
        List<Notification> list = (userId != null)
                ? notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                : notificationRepository.findAll();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        if (userId != null) {
            List<Notification> list = notificationRepository.findByUserIdAndIsReadFalse(userId);
            for (Notification n : list) {
                n.setIsRead(true);
            }
            notificationRepository.saveAll(list);
        }
    }

    @Override
    @Transactional
    public NotificationDto sendNotification(NotificationDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getUserId()));

        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : user.getSociety();

        Notification n = new Notification();
        n.setSociety(society);
        n.setUser(user);
        n.setTitle(dto.getTitle());
        n.setMessage(dto.getMessage());
        n.setCategory(dto.getCategory() != null ? dto.getCategory() : "GENERAL");
        n.setIsRead(false);
        n.setLinkTab(dto.getLinkTab());

        return toDto(notificationRepository.save(n));
    }

    private NotificationDto toDto(Notification n) {
        NotificationDto d = new NotificationDto();
        d.setId(n.getId());
        if (n.getSociety() != null) d.setSocietyId(n.getSociety().getId());
        if (n.getUser() != null) d.setUserId(n.getUser().getId());
        d.setTitle(n.getTitle());
        d.setMessage(n.getMessage());
        d.setCategory(n.getCategory());
        d.setIsRead(n.getIsRead());
        d.setLinkTab(n.getLinkTab());
        d.setCreatedAt(n.getCreatedAt());
        return d;
    }
}

