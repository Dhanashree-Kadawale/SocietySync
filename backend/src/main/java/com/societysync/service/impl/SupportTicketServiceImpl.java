package com.societysync.service.impl;

import com.societysync.dto.SupportTicketDto;
import com.societysync.entity.Society;
import com.societysync.entity.SupportTicket;
import com.societysync.entity.SupportTicketMessage;
import com.societysync.entity.User;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.SocietyRepository;
import com.societysync.repository.SupportTicketMessageRepository;
import com.societysync.repository.SupportTicketRepository;
import com.societysync.repository.UserRepository;
import com.societysync.service.SupportTicketService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportTicketServiceImpl implements SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final SupportTicketMessageRepository messageRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    public SupportTicketServiceImpl(SupportTicketRepository ticketRepository,
                                    SupportTicketMessageRepository messageRepository,
                                    SocietyRepository societyRepository,
                                    UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupportTicketDto> getTickets(Long societyId, String status) {
        List<SupportTicket> list = (societyId != null)
                ? ticketRepository.findBySocietyId(societyId)
                : ticketRepository.findAll();
        if (status != null && !status.isEmpty()) {
            list = list.stream().filter(t -> status.equalsIgnoreCase(t.getStatus())).collect(Collectors.toList());
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SupportTicketDto getTicketById(Long id) {
        SupportTicket t = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
        return toDto(t);
    }

    @Override
    @Transactional
    public SupportTicketDto createTicket(SupportTicketDto dto) {
        Society society = dto.getSocietyId() != null
                ? societyRepository.findById(dto.getSocietyId()).orElse(null)
                : societyRepository.findAll().stream().findFirst().orElse(null);

        User requester = null;
        if (dto.getRequesterId() != null) {
            requester = userRepository.findById(dto.getRequesterId()).orElse(null);
        } else {
            requester = userRepository.findAll().stream().findFirst().orElse(null);
        }

        SupportTicket t = new SupportTicket();
        t.setSociety(society);
        t.setRequester(requester);
        t.setSubject(dto.getSubject());
        t.setCategory(dto.getCategory() != null ? dto.getCategory() : "GENERAL");
        t.setPriority(dto.getPriority() != null ? dto.getPriority() : "NORMAL");
        t.setStatus("OPEN");

        SupportTicket saved = ticketRepository.save(t);
        return toDto(saved);
    }

    @Override
    @Transactional
    public SupportTicketDto.SupportTicketMessageDto addMessage(Long ticketId, SupportTicketDto.SupportTicketMessageDto msgDto) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));

        User sender = null;
        if (msgDto.getSenderId() != null) {
            sender = userRepository.findById(msgDto.getSenderId()).orElse(null);
        }

        SupportTicketMessage msg = new SupportTicketMessage();
        msg.setTicket(ticket);
        msg.setSender(sender);
        msg.setSenderName(msgDto.getSenderName() != null ? msgDto.getSenderName() : (sender != null ? sender.getName() : "Support Agent"));
        msg.setMessageText(msgDto.getMessageText());
        msg.setIsStaff(msgDto.getIsStaff() != null ? msgDto.getIsStaff() : false);

        SupportTicketMessage savedMsg = messageRepository.save(msg);

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return toMessageDto(savedMsg);
    }

    @Override
    @Transactional
    public SupportTicketDto updateStatus(Long id, String status) {
        SupportTicket t = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
        t.setStatus(status);
        t.setUpdatedAt(LocalDateTime.now());
        return toDto(ticketRepository.save(t));
    }

    private SupportTicketDto toDto(SupportTicket t) {
        SupportTicketDto d = new SupportTicketDto();
        d.setId(t.getId());
        if (t.getSociety() != null) {
            d.setSocietyId(t.getSociety().getId());
            d.setSocietyName(t.getSociety().getName());
        }
        if (t.getRequester() != null) {
            d.setRequesterId(t.getRequester().getId());
            d.setRequesterName(t.getRequester().getName());
        }
        d.setSubject(t.getSubject());
        d.setCategory(t.getCategory());
        d.setPriority(t.getPriority());
        d.setStatus(t.getStatus());
        d.setCreatedAt(t.getCreatedAt());
        d.setUpdatedAt(t.getUpdatedAt());

        List<SupportTicketMessage> msgs = messageRepository.findByTicketIdOrderByCreatedAtAsc(t.getId());
        d.setMessages(msgs.stream().map(this::toMessageDto).collect(Collectors.toList()));

        return d;
    }

    private SupportTicketDto.SupportTicketMessageDto toMessageDto(SupportTicketMessage m) {
        SupportTicketDto.SupportTicketMessageDto d = new SupportTicketDto.SupportTicketMessageDto();
        d.setId(m.getId());
        if (m.getSender() != null) d.setSenderId(m.getSender().getId());
        d.setSenderName(m.getSenderName());
        d.setMessageText(m.getMessageText());
        d.setIsStaff(m.getIsStaff());
        d.setCreatedAt(m.getCreatedAt());
        return d;
    }
}

