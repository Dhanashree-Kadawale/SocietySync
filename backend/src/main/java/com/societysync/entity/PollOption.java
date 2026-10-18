package com.societysync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "poll_options")
public class PollOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @Column(name = "option_text", nullable = false, length = 255)
    private String optionText;

    @Column(name = "vote_count", nullable = false)
    private Integer voteCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PollOption() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Poll getPoll() { return poll; }
    public void setPoll(Poll poll) { this.poll = poll; }

    public String getOptionText() { return optionText; }
    public void setOptionText(String optionText) { this.optionText = optionText; }

    public Integer getVoteCount() { return voteCount; }
    public void setVoteCount(Integer voteCount) { this.voteCount = voteCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
