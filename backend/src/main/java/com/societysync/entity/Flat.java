package com.societysync.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flats", uniqueConstraints = {
    @UniqueConstraint(name = "uq_flats_building_number", columnNames = {"building_id", "flat_number"})
})
public class Flat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @Column(name = "flat_number", nullable = false, length = 50)
    private String flatNumber;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber = 1;

    @Column(name = "bhk_type", nullable = false, length = 20)
    private String bhkType = "2BHK";

    @Column(name = "carpet_area_sqft", nullable = false, precision = 10, scale = 2)
    private BigDecimal carpetAreaSqft = BigDecimal.ZERO;

    @Column(name = "parking_slot", length = 50)
    private String parkingSlot;

    @Column(name = "intercom_number", length = 20)
    private String intercomNumber;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "VACANT";

    @Column(name = "owner_name", length = 100)
    private String ownerName;

    @Column(name = "owner_phone", length = 20)
    private String ownerPhone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Flat() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Society getSociety() { return society; }
    public void setSociety(Society society) { this.society = society; }

    public Building getBuilding() { return building; }
    public void setBuilding(Building building) { this.building = building; }

    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }

    public Integer getFloorNumber() { return floorNumber; }
    public void setFloorNumber(Integer floorNumber) { this.floorNumber = floorNumber; }

    public String getBhkType() { return bhkType; }
    public void setBhkType(String bhkType) { this.bhkType = bhkType; }

    public BigDecimal getCarpetAreaSqft() { return carpetAreaSqft; }
    public void setCarpetAreaSqft(BigDecimal carpetAreaSqft) { this.carpetAreaSqft = carpetAreaSqft; }

    public String getParkingSlot() { return parkingSlot; }
    public void setParkingSlot(String parkingSlot) { this.parkingSlot = parkingSlot; }

    public String getIntercomNumber() { return intercomNumber; }
    public void setIntercomNumber(String intercomNumber) { this.intercomNumber = intercomNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
