package com.societysync.dto;

public class BuildingDto {
    private Long id;
    private Long societyId;
    private String name;
    private Integer totalFloors;
    private Long totalFlats;

    public BuildingDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSocietyId() { return societyId; }
    public void setSocietyId(Long societyId) { this.societyId = societyId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getTotalFloors() { return totalFloors; }
    public void setTotalFloors(Integer totalFloors) { this.totalFloors = totalFloors; }

    public Long getTotalFlats() { return totalFlats; }
    public void setTotalFlats(Long totalFlats) { this.totalFlats = totalFlats; }
}

