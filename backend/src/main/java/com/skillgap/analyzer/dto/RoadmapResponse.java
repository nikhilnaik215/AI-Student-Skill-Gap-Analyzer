package com.skillgap.analyzer.dto;

import java.util.ArrayList;
import java.util.List;

public class RoadmapResponse {

    private Long id;
    private String title;
    private String targetRoleTitle;
    private int durationWeeks;
    private String createdAt;
    private String summary;
    private List<RoadmapModuleDto> modules = new ArrayList<>();

    public RoadmapResponse() {}

    public RoadmapResponse(Long id, String title, String targetRoleTitle, int durationWeeks, String createdAt, String summary, List<RoadmapModuleDto> modules) {
        this.id = id;
        this.title = title;
        this.targetRoleTitle = targetRoleTitle;
        this.durationWeeks = durationWeeks;
        this.createdAt = createdAt;
        this.summary = summary;
        this.modules = modules;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTargetRoleTitle() {
        return targetRoleTitle;
    }

    public void setTargetRoleTitle(String targetRoleTitle) {
        this.targetRoleTitle = targetRoleTitle;
    }

    public int getDurationWeeks() {
        return durationWeeks;
    }

    public void setDurationWeeks(int durationWeeks) {
        this.durationWeeks = durationWeeks;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<RoadmapModuleDto> getModules() {
        return modules;
    }

    public void setModules(List<RoadmapModuleDto> modules) {
        this.modules = modules;
    }
}
