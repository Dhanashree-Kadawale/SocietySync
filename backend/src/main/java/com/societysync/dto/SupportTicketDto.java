package com.societysync.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SupportTicketDto {
    private Long id;
    private Long societyId;
    private String societyName;
    private Long requesterId;
    private String requesterName;
    private String subject;
    private String category;
    private String priority;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<SupportTicketMessageDto> messages = new ArrayList<>();

    public static class SupportTicketMessageDto {
        private Long id;
        private Long senderId;
        private String senderName;
        private String messageText;
        private Boolean isStaff;
        private LocalDateTime createdAt;

        public SupportTicketMessageDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }
        public String getMessageText() { return messageText; }
        public void setMessageText(String messageText) { this.messageText = messageText; }
        public Boolean getIsStaff() { return isStaff; }
        public void setIsStaff(Boolean isStaff) { this.isStaff = isStaff; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public SupportTicketDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getSocietyName() { return societyName; }
    public void setSocietyName(String societyName) { this.societyName = societyName; }

    public Long getRequesterId() { return requesterId; }
    public void setRequesterId(Long requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<SupportTicketMessageDto> getMessages() { return messages; }
    public void setMessages(List<SupportTicketMessageDto> messages) { this.messages = messages; }
}

