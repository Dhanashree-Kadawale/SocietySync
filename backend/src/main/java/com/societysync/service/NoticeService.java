package com.societysync.service;

import com.societysync.dto.NoticeDto;

import java.util.List;

public interface NoticeService {
    List<NoticeDto> getNotices(Long societyId);
    NoticeDto getNoticeById(Long id);
    NoticeDto createNotice(NoticeDto dto);
    NoticeDto updateNotice(Long id, NoticeDto dto);
    void deleteNotice(Long id);
}

