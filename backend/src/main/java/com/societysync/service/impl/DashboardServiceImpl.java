package com.societysync.service.impl;

import com.societysync.dto.DashboardStatsDto;
import com.societysync.entity.MaintenanceBill;
import com.societysync.entity.Society;
import com.societysync.repository.*;
import com.societysync.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final FlatRepository flatRepository;
    private final ResidentRepository residentRepository;
    private final StaffRepository staffRepository;
    private final ComplaintRepository complaintRepository;
    private final MaintenanceBillRepository billRepository;
    private final VisitorRepository visitorRepository;
    private final NoticeRepository noticeRepository;
    private final FacilityBookingRepository bookingRepository;
    private final SocietyRepository societyRepository;

    public DashboardServiceImpl(FlatRepository flatRepository,
                                ResidentRepository residentRepository,
                                StaffRepository staffRepository,
                                ComplaintRepository complaintRepository,
                                MaintenanceBillRepository billRepository,
                                VisitorRepository visitorRepository,
                                NoticeRepository noticeRepository,
                                FacilityBookingRepository bookingRepository,
                                SocietyRepository societyRepository) {
        this.flatRepository = flatRepository;
        this.residentRepository = residentRepository;
        this.staffRepository = staffRepository;
        this.complaintRepository = complaintRepository;
        this.billRepository = billRepository;
        this.visitorRepository = visitorRepository;
        this.noticeRepository = noticeRepository;
        this.bookingRepository = bookingRepository;
        this.societyRepository = societyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(Long societyId) {
        Long targetSocietyId = societyId;
        if (targetSocietyId == null) {
            targetSocietyId = societyRepository.findAll().stream().findFirst().map(Society::getId).orElse(1L);
        }

        DashboardStatsDto dto = new DashboardStatsDto();

        var flats = flatRepository.findBySocietyId(targetSocietyId);
        dto.setTotalFlats(flats.size());
        dto.setOccupiedFlats(flats.stream().filter(f -> "OCCUPIED".equalsIgnoreCase(f.getStatus())).count());
        dto.setVacantFlats(flats.stream().filter(f -> !"OCCUPIED".equalsIgnoreCase(f.getStatus())).count());

        dto.setTotalResidents(residentRepository.findBySocietyId(targetSocietyId).size());
        dto.setTotalStaff(staffRepository.findBySocietyId(targetSocietyId).size());

        var complaints = complaintRepository.findBySocietyId(targetSocietyId);
        dto.setOpenComplaints(complaints.stream().filter(c -> "OPEN".equalsIgnoreCase(c.getStatus())).count());
        dto.setInProgressComplaints(complaints.stream().filter(c -> "IN_PROGRESS".equalsIgnoreCase(c.getStatus())).count());
        dto.setResolvedComplaints(complaints.stream().filter(c -> "RESOLVED".equalsIgnoreCase(c.getStatus()) || "CLOSED".equalsIgnoreCase(c.getStatus())).count());

        var bills = billRepository.findBySocietyId(targetSocietyId);
        BigDecimal collected = BigDecimal.ZERO;
        BigDecimal pending = BigDecimal.ZERO;
        for (MaintenanceBill b : bills) {
            if ("PAID".equalsIgnoreCase(b.getStatus())) {
                collected = collected.add(b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO);
            } else {
                pending = pending.add(b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO);
            }
        }
        dto.setMonthlyCollection(collected);
        dto.setPendingDues(pending);

        var visitors = visitorRepository.findBySocietyId(targetSocietyId);
        dto.setPendingVisitors(visitors.stream().filter(v -> "EXPECTED".equalsIgnoreCase(v.getStatus()) || "CHECKED_IN".equalsIgnoreCase(v.getStatus())).count());

        dto.setActiveNotices(noticeRepository.findBySocietyIdOrderByPostedAtDesc(targetSocietyId).size());
        dto.setUpcomingBookings(bookingRepository.findBySocietyId(targetSocietyId).size());

        // Recent activity feed
        List<Map<String, Object>> activities = new ArrayList<>();
        complaints.stream().limit(3).forEach(c -> {
            Map<String, Object> act = new HashMap<>();
            act.put("id", "ACT-CMP-" + c.getId());
            act.put("type", "complaint");
            act.put("title", "Complaint: " + c.getTitle());
            act.put("status", c.getStatus());
            act.put("time", c.getCreatedAt());
            activities.add(act);
        });
        bills.stream().limit(3).forEach(b -> {
            Map<String, Object> act = new HashMap<>();
            act.put("id", "ACT-BILL-" + b.getId());
            act.put("type", "billing");
            act.put("title", "Bill " + b.getBillNumber() + " - " + b.getStatus());
            act.put("amount", b.getTotalAmount());
            act.put("time", b.getIssuedDate());
            activities.add(act);
        });
        dto.setRecentActivities(activities);

        return dto;
    }
}

