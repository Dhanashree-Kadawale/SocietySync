package com.societysync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_ticket_messages")
public class SupportTicketMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private SupportTicket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(name = "sender_name", nullable = false, length = 100)
    private String senderName;

    @Column(name = "message_text", nullable = false, columnDefinition = "TEXT")
    private String messageText;

    @Column(name = "is_staff", nullable = false)
    private Boolean isStaff = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SupportTicketMessage() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SupportTicket getTicket() { return ticket; }
    public void setTicket(SupportTicket ticket) { this.ticket = ticket; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public Boolean getIsStaff() { return isStaff; }
    public void setIsStaff(Boolean isStaff) { this.isStaff = isStaff; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
