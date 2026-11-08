package com.societysync.repository;

import com.societysync.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlatRepository extends JpaRepository<Flat, Long> {
    List<Flat> findBySocietyId(Long societyId);
    List<Flat> findByBuildingId(Long buildingId);
    List<Flat> findBySocietyIdAndBuildingId(Long societyId, Long buildingId);
    Optional<Flat> findByBuildingIdAndFlatNumber(Long buildingId, String flatNumber);
    long countByBuildingId(Long buildingId);
    long countBySocietyIdAndStatus(Long societyId, String status);
}
