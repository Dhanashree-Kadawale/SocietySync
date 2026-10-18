package com.societysync.repository;

import com.societysync.entity.FacilityBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FacilityBookingRepository extends JpaRepository<FacilityBooking, Long> {
    List<FacilityBooking> findBySocietyId(Long societyId);
    List<FacilityBooking> findByFacilityIdAndBookingDate(Long facilityId, LocalDate bookingDate);
    List<FacilityBooking> findByResidentId(Long residentId);
}
