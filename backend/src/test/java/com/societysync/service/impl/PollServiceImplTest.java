package com.societysync.service.impl;

import com.societysync.dto.PollDto;
import com.societysync.entity.Poll;
import com.societysync.entity.PollOption;
import com.societysync.entity.Society;
import com.societysync.entity.User;
import com.societysync.exception.BadRequestException;
import com.societysync.repository.PollOptionRepository;
import com.societysync.repository.PollRepository;
import com.societysync.repository.PollVoteRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PollServiceImplTest {

    private PollRepository pollRepository;
    private PollOptionRepository optionRepository;
    private PollVoteRepository voteRepository;
    private SocietyRepository societyRepository;
    private UserRepository userRepository;
    private PollServiceImpl service;

    @BeforeEach
    void setUp() {
        pollRepository = mock(PollRepository.class);
        optionRepository = mock(PollOptionRepository.class);
        voteRepository = mock(PollVoteRepository.class);
        societyRepository = mock(SocietyRepository.class);
        userRepository = mock(UserRepository.class);
        service = new PollServiceImpl(
                pollRepository, optionRepository, voteRepository, societyRepository, userRepository);
    }

    @Test
    void createPollPersistsItAndItsOptionsForTheSelectedSociety() {
        Society society = new Society();
        society.setId(4L);
        User creator = new User();
        creator.setId(12L);
        creator.setSociety(society);
        when(societyRepository.findById(4L)).thenReturn(Optional.of(society));
        when(userRepository.findById(12L)).thenReturn(Optional.of(creator));
        when(pollRepository.save(any(Poll.class))).thenAnswer(invocation -> {
            Poll poll = invocation.getArgument(0);
            poll.setId(55L);
            return poll;
        });
        when(optionRepository.findByPollId(55L)).thenReturn(List.of());

        PollDto request = new PollDto();
        request.setSocietyId(4L);
        request.setCreatedById(12L);
        request.setTitle("Choose a maintenance schedule");
        request.setEndDate(LocalDateTime.now().plusDays(2));
        request.setOptions(List.of(
                new PollDto.PollOptionDto(null, "Morning", 0),
                new PollDto.PollOptionDto(null, "Evening", 0)));

        PollDto result = service.createPoll(request);

        assertEquals(55L, result.getId());
        assertEquals("Choose a maintenance schedule", result.getTitle());
        verify(optionRepository, times(2)).save(any(PollOption.class));
    }

    @Test
    void createPollRejectsCreatorFromAnotherSociety() {
        Society pollSociety = new Society();
        pollSociety.setId(4L);
        Society otherSociety = new Society();
        otherSociety.setId(9L);
        User creator = new User();
        creator.setId(12L);
        creator.setSociety(otherSociety);
        when(societyRepository.findById(4L)).thenReturn(Optional.of(pollSociety));
        when(userRepository.findById(12L)).thenReturn(Optional.of(creator));

        PollDto request = new PollDto();
        request.setSocietyId(4L);
        request.setCreatedById(12L);
        request.setTitle("Choose a maintenance schedule");
        request.setEndDate(LocalDateTime.now().plusDays(2));
        request.setOptions(List.of(
                new PollDto.PollOptionDto(null, "Morning", 0),
                new PollDto.PollOptionDto(null, "Evening", 0)));

        assertThrows(BadRequestException.class, () -> service.createPoll(request));
        verify(pollRepository, never()).save(any(Poll.class));
    }
}
