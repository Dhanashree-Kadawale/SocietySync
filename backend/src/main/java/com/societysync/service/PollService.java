package com.societysync.service;

import com.societysync.dto.PollDto;

import java.util.List;

public interface PollService {
    List<PollDto> getPolls(Long societyId, Long userId);
    PollDto getPollById(Long id, Long userId);
    PollDto createPoll(PollDto dto);
    PollDto updatePoll(Long id, PollDto dto);
    void deletePoll(Long id, Long societyId);
    PollDto vote(Long pollId, Long optionId, Long userId);
}
