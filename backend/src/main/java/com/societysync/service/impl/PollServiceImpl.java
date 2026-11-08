package com.societysync.service.impl;

import com.societysync.dto.PollDto;
import com.societysync.entity.Poll;
import com.societysync.entity.PollOption;
import com.societysync.entity.PollVote;
import com.societysync.entity.Society;
import com.societysync.entity.User;
import com.societysync.exception.BadRequestException;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.PollOptionRepository;
import com.societysync.repository.PollRepository;
import com.societysync.repository.PollVoteRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.PollService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PollServiceImpl implements PollService {

    private final PollRepository pollRepository;
    private final PollOptionRepository optionRepository;
    private final PollVoteRepository voteRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    public PollServiceImpl(PollRepository pollRepository,
                           PollOptionRepository optionRepository,
                           PollVoteRepository voteRepository,
                           SocietyRepository societyRepository,
                           UserRepository userRepository) {
        this.pollRepository = pollRepository;
        this.optionRepository = optionRepository;
        this.voteRepository = voteRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PollDto> getPolls(Long societyId, Long userId) {
        List<Poll> list = (societyId != null)
                ? pollRepository.findBySocietyId(societyId)
                : pollRepository.findAll();
        return list.stream().map(p -> toDto(p, userId)).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PollDto getPollById(Long id, Long userId) {
        Poll p = pollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found: " + id));
        return toDto(p, userId);
    }

    @Override
    @Transactional
    public PollDto createPoll(PollDto dto) {
        if (dto.getEndDate() == null) {
            dto.setEndDate(LocalDateTime.now().plusDays(7));
        }
        validatePoll(dto, true);
        Society society = societyRepository.findById(dto.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + dto.getSocietyId()));
        User creator = userRepository.findById(dto.getCreatedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getCreatedById()));
        if (creator.getSociety() == null || !Objects.equals(creator.getSociety().getId(), society.getId())) {
            throw new BadRequestException("The poll creator must belong to the selected society");
        }

        Poll p = new Poll();
        p.setSociety(society);
        p.setCreatedBy(creator);
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setCategory(dto.getCategory() != null ? dto.getCategory() : "GENERAL");
        p.setStatus("ACTIVE");
        p.setEndDate(dto.getEndDate() != null ? dto.getEndDate() : LocalDateTime.now().plusDays(7));

        Poll saved = pollRepository.save(p);

        saveOptions(saved, dto.getOptions());

        return toDto(saved, creator.getId());
    }

    @Override
    @Transactional
    public PollDto updatePoll(Long id, PollDto dto) {
        validatePoll(dto, false);
        Society society = societyRepository.findById(dto.getSocietyId())
                .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + dto.getSocietyId()));
        Poll poll = pollRepository.findByIdAndSocietyId(id, society.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found: " + id));

        if (!voteRepository.findByPollId(id).isEmpty()) {
            throw new BadRequestException("A poll cannot be edited after voting has started");
        }

        poll.setTitle(dto.getTitle().trim());
        poll.setDescription(dto.getDescription());
        poll.setCategory(dto.getCategory() != null ? dto.getCategory() : poll.getCategory());
        poll.setEndDate(dto.getEndDate());
        poll.setUpdatedAt(LocalDateTime.now());

        if (dto.getOptions() != null) {
            poll.getOptions().clear();
            saveOptions(poll, dto.getOptions());
        }

        return toDto(pollRepository.save(poll), poll.getCreatedBy() != null ? poll.getCreatedBy().getId() : null);
    }

    @Override
    @Transactional
    public void deletePoll(Long id, Long societyId) {
        Poll poll = pollRepository.findByIdAndSocietyId(id, societyId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found: " + id));
        pollRepository.delete(poll);
    }

    @Override
    @Transactional
    public PollDto vote(Long pollId, Long optionId, Long userId) {
        if (optionId == null || userId == null) {
            throw new BadRequestException("User ID and poll option ID are required to cast a vote");
        }
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found: " + pollId));
        if (!"ACTIVE".equalsIgnoreCase(poll.getStatus()) || !poll.getEndDate().isAfter(LocalDateTime.now())) {
            throw new BadRequestException("This poll is closed and no longer accepting votes");
        }

        User user = (userId != null)
                ? userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId))
                : null;
        if (user == null) {
            throw new BadRequestException("A user ID is required to cast a vote");
        }
        if (poll.getSociety() == null || user.getSociety() == null
                || !Objects.equals(poll.getSociety().getId(), user.getSociety().getId())) {
            throw new BadRequestException("You can only vote in polls for your society");
        }

        if (voteRepository.existsByPollIdAndUserId(pollId, user.getId())) {
            throw new BadRequestException("You have already voted in this poll");
        }

        PollOption option = optionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("Poll option not found: " + optionId));
        if (option.getPoll() == null || !Objects.equals(option.getPoll().getId(), pollId)) {
            throw new BadRequestException("The selected option does not belong to this poll");
        }

        option.setVoteCount(option.getVoteCount() + 1);
        optionRepository.save(option);

        PollVote vote = new PollVote();
        vote.setPoll(poll);
        vote.setOption(option);
        vote.setUser(user);
        voteRepository.save(vote);

        return toDto(poll, user.getId());
    }

    private void validatePoll(PollDto dto, boolean creating) {
        if (dto.getSocietyId() == null) {
            throw new BadRequestException("Society ID is required");
        }
        if (creating && dto.getCreatedById() == null) {
            throw new BadRequestException("Creator ID is required");
        }
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Poll question is required");
        }
        if (dto.getEndDate() == null || !dto.getEndDate().isAfter(LocalDateTime.now())) {
            throw new BadRequestException("Poll deadline must be in the future");
        }
        if (creating && (dto.getOptions() == null || dto.getOptions().size() < 2)) {
            throw new BadRequestException("A poll must have at least two options");
        }
        if (dto.getOptions() != null && (dto.getOptions().size() < 2
                || dto.getOptions().stream().anyMatch(option ->
                        option.getOptionText() == null || option.getOptionText().trim().isEmpty()))) {
            throw new BadRequestException("A poll must have at least two non-empty options");
        }
    }

    private void saveOptions(Poll poll, List<PollDto.PollOptionDto> options) {
        for (PollDto.PollOptionDto optionDto : options) {
            PollOption option = new PollOption();
            option.setPoll(poll);
            option.setOptionText(optionDto.getOptionText().trim());
            option.setVoteCount(0);
            optionRepository.save(option);
        }
    }

    private PollDto toDto(Poll p, Long currentUserId) {
        PollDto d = new PollDto();
        d.setId(p.getId());
        if (p.getSociety() != null) d.setSocietyId(p.getSociety().getId());
        if (p.getCreatedBy() != null) {
            d.setCreatedById(p.getCreatedBy().getId());
            d.setCreatedByName(p.getCreatedBy().getName());
        }
        d.setTitle(p.getTitle());
        d.setDescription(p.getDescription());
        d.setCategory(p.getCategory());
        d.setStatus(p.getStatus());
        d.setEndDate(p.getEndDate());
        d.setCreatedAt(p.getCreatedAt());

        List<PollOption> opts = optionRepository.findByPollId(p.getId());
        int totalVotes = 0;
        for (PollOption opt : opts) {
            totalVotes += (opt.getVoteCount() != null ? opt.getVoteCount() : 0);
            d.getOptions().add(new PollDto.PollOptionDto(opt.getId(), opt.getOptionText(), opt.getVoteCount()));
        }
        d.setTotalVotes(totalVotes);

        if (currentUserId != null) {
            voteRepository.findByPollIdAndUserId(p.getId(), currentUserId).ifPresent(v -> {
                d.setUserVotedOptionId(v.getOption().getId());
            });
        }

        return d;
    }
}
