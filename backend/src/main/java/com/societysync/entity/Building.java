package com.societysync.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "buildings", uniqueConstraints = {
    @UniqueConstraint(name = "uq_building_society_name", columnNames = {"society_id", "name"})
})
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "total_floors", nullable = false)
    private Integer totalFloors = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Building() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Society getSociety() { return society; }
    public void setSociety(Society society) { this.society = society; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getTotalFloors() { return totalFloors; }
    public void setTotalFloors(Integer totalFloors) { this.totalFloors = totalFloors; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
