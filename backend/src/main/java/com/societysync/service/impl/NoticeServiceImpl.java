package com.societysync.service.impl;

import com.societysync.dto.NoticeDto;
import com.societysync.entity.Notice;
import com.societysync.entity.Society;
import com.societysync.entity.User;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.NoticeRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.NoticeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    public NoticeServiceImpl(NoticeRepository noticeRepository,
                             SocietyRepository societyRepository,
                             UserRepository userRepository) {
        this.noticeRepository = noticeRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeDto> getNotices(Long societyId) {
        List<Notice> list = (societyId != null)
                ? noticeRepository.findBySocietyIdOrderByPostedAtDesc(societyId)
                : noticeRepository.findAll();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NoticeDto getNoticeById(Long id) {
        Notice n = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found: " + id));
        return toDto(n);
    }

    @Override
    @Transactional
    public NoticeDto createNotice(NoticeDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        User author = null;
        if (dto.getAuthorId() != null) {
            author = userRepository.findById(dto.getAuthorId()).orElse(null);
        } else {
            author = userRepository.findAll().stream().findFirst().orElse(null);
        }

        Notice n = new Notice();
        n.setSociety(society);
        n.setAuthor(author);
        n.setTitle(dto.getTitle());
        n.setContent(dto.getContent());
        n.setCategory(dto.getCategory() != null ? dto.getCategory() : "GENERAL");
        n.setPriority(dto.getPriority() != null ? dto.getPriority() : "NORMAL");
        n.setIsPinned(dto.getIsPinned() != null ? dto.getIsPinned() : false);
        n.setPostedAt(dto.getPostedAt() != null ? dto.getPostedAt() : LocalDateTime.now());
        n.setExpiresAt(dto.getExpiresAt());

        return toDto(noticeRepository.save(n));
    }

    @Override
    @Transactional
    public NoticeDto updateNotice(Long id, NoticeDto dto) {
        Notice n = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found: " + id));

        if (dto.getTitle() != null) n.setTitle(dto.getTitle());
        if (dto.getContent() != null) n.setContent(dto.getContent());
        if (dto.getCategory() != null) n.setCategory(dto.getCategory());
        if (dto.getPriority() != null) n.setPriority(dto.getPriority());
        if (dto.getIsPinned() != null) n.setIsPinned(dto.getIsPinned());
        n.setUpdatedAt(LocalDateTime.now());

        return toDto(noticeRepository.save(n));
    }

    @Override
    @Transactional
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notice not found: " + id);
        }
        noticeRepository.deleteById(id);
    }

    private NoticeDto toDto(Notice n) {
        NoticeDto d = new NoticeDto();
        d.setId(n.getId());
        if (n.getSociety() != null) d.setSocietyId(n.getSociety().getId());
        if (n.getAuthor() != null) {
            d.setAuthorId(n.getAuthor().getId());
            d.setAuthorName(n.getAuthor().getName());
        }
        d.setTitle(n.getTitle());
        d.setContent(n.getContent());
        d.setCategory(n.getCategory());
        d.setPriority(n.getPriority());
        d.setIsPinned(n.getIsPinned());
        d.setPostedAt(n.getPostedAt());
        d.setExpiresAt(n.getExpiresAt());
        return d;
    }
}

