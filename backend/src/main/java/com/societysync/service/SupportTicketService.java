package com.societysync.service;

import com.societysync.dto.SupportTicketDto;

import java.util.List;

public interface SupportTicketService {
    List<SupportTicketDto> getTickets(Long societyId, String status);
    SupportTicketDto getTicketById(Long id);
    SupportTicketDto createTicket(SupportTicketDto dto);
    SupportTicketDto.SupportTicketMessageDto addMessage(Long ticketId, SupportTicketDto.SupportTicketMessageDto msgDto);
    SupportTicketDto updateStatus(Long id, String status);
}

