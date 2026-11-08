package com.societysync.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PollDto {
    private Long id;
    private Long societyId;
    private Long createdById;
    private String createdByName;
    private String title;
    private String description;
    private String category;
    private String status; // ACTIVE, CLOSED
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private List<PollOptionDto> options = new ArrayList<>();
    private Integer totalVotes = 0;
    private Long userVotedOptionId;

    public static class PollOptionDto {
        private Long id;
        private String optionText;
        private Integer voteCount;

        public PollOptionDto() {}
        public PollOptionDto(Long id, String optionText, Integer voteCount) {
            this.id = id;
            this.optionText = optionText;
            this.voteCount = voteCount;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOptionText() { return optionText; }
        public void setOptionText(String optionText) { this.optionText = optionText; }
        public Integer getVoteCount() { return voteCount; }
        public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }
    }

    public PollDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<PollOptionDto> getOptions() { return options; }
    public void setOptions(List<PollOptionDto> options) { this.options = options; }

    public Integer getTotalVotes() { return totalVotes; }
    public void setTotalVotes(Integer totalVotes) { this.totalVotes = totalVotes; }

    public Long getUserVotedOptionId() { return userVotedOptionId; }
    public void setUserVotedOptionId(Long userVotedOptionId) { this.userVotedOptionId = userVotedOptionId; }
}

