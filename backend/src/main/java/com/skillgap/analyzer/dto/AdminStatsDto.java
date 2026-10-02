package com.skillgap.analyzer.dto;

import java.util.HashMap;
import java.util.Map;

public class AdminStatsDto {

    private long totalStudents;
    private long totalRoles;
    private long totalSkills;
    private long totalRoadmaps;
    private Map<String, Long> studentsPerRole = new HashMap<>();

    public AdminStatsDto() {}

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalRoles() {
        return totalRoles;
    }

    public void setTotalRoles(long totalRoles) {
        this.totalRoles = totalRoles;
    }

    public long getTotalSkills() {
        return totalSkills;
    }

    public void setTotalSkills(long totalSkills) {
        this.totalSkills = totalSkills;
    }

    public long getTotalRoadmaps() {
        return totalRoadmaps;
    }

    public void setTotalRoadmaps(long totalRoadmaps) {
        this.totalRoadmaps = totalRoadmaps;
    }

    public Map<String, Long> getStudentsPerRole() {
        return studentsPerRole;
    }

    public void setStudentsPerRole(Map<String, Long> studentsPerRole) {
        this.studentsPerRole = studentsPerRole;
    }
}
