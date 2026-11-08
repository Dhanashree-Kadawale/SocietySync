package com.societysync.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalFlats;
    private long occupiedFlats;
    private long vacantFlats;
    private long totalResidents;
    private long totalStaff;
    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private BigDecimal monthlyCollection;
    private BigDecimal pendingDues;
    private long pendingVisitors;
    private long activeNotices;
    private long upcomingBookings;
    private List<Map<String, Object>> recentActivities;

    public DashboardStatsDto() {}

    public long getTotalFlats() { return totalFlats; }
    public void setTotalFlats(long totalFlats) { this.totalFlats = totalFlats; }

    public long getOccupiedFlats() { return occupiedFlats; }
    public void setOccupiedFlats(long occupiedFlats) { this.occupiedFlats = occupiedFlats; }

    public long getVacantFlats() { return vacantFlats; }
    public void setVacantFlats(long vacantFlats) { this.vacantFlats = vacantFlats; }

    public long getTotalResidents() { return totalResidents; }
    public void setTotalResidents(long totalResidents) { this.totalResidents = totalResidents; }

    public long getTotalStaff() { return totalStaff; }
    public void setTotalStaff(long totalStaff) { this.totalStaff = totalStaff; }

    public long getOpenComplaints() { return openComplaints; }
    public void setOpenComplaints(long openComplaints) { this.openComplaints = openComplaints; }

    public long getInProgressComplaints() { return inProgressComplaints; }
    public void setInProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }

    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

    public BigDecimal getMonthlyCollection() { return monthlyCollection; }
    public void setMonthlyCollection(BigDecimal monthlyCollection) { this.monthlyCollection = monthlyCollection; }

    public BigDecimal getPendingDues() { return pendingDues; }
    public void setPendingDues(BigDecimal pendingDues) { this.pendingDues = pendingDues; }

    public long getPendingVisitors() { return pendingVisitors; }
    public void setPendingVisitors(long pendingVisitors) { this.pendingVisitors = pendingVisitors; }

    public long getActiveNotices() { return activeNotices; }
    public void setActiveNotices(long activeNotices) { this.activeNotices = activeNotices; }

    public long getUpcomingBookings() { return upcomingBookings; }
    public void setUpcomingBookings(long upcomingBookings) { this.upcomingBookings = upcomingBookings; }

    public List<Map<String, Object>> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<Map<String, Object>> recentActivities) { this.recentActivities = recentActivities; }
}

