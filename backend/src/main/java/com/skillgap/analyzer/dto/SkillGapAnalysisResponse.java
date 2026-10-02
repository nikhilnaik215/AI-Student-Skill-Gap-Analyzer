package com.skillgap.analyzer.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SkillGapAnalysisResponse {

    private Long studentId;
    private String studentName;
    private Long jobRoleId;
    private String jobRoleTitle;
    private String jobRoleDescription;
    private double overallMatchPercentage;
    private String readinessStatus;
    private String readinessBadgeColor;
    private int totalRoleSkills;
    private int matchedSkillsCount;
    private int missingSkillsCount;
    private List<MatchedSkillDto> matchedSkills = new ArrayList<>();
    private List<MissingSkillDto> missingSkills = new ArrayList<>();
    private Map<String, Integer> categorySkillCounts = new HashMap<>();
    private String aiSummaryRecommendation;

    public SkillGapAnalysisResponse() {}

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getJobRoleId() {
        return jobRoleId;
    }

    public void setJobRoleId(Long jobRoleId) {
        this.jobRoleId = jobRoleId;
    }

    public String getJobRoleTitle() {
        return jobRoleTitle;
    }

    public void setJobRoleTitle(String jobRoleTitle) {
        this.jobRoleTitle = jobRoleTitle;
    }

    public String getJobRoleDescription() {
        return jobRoleDescription;
    }

    public void setJobRoleDescription(String jobRoleDescription) {
        this.jobRoleDescription = jobRoleDescription;
    }

    public double getOverallMatchPercentage() {
        return overallMatchPercentage;
    }

    public void setOverallMatchPercentage(double overallMatchPercentage) {
        this.overallMatchPercentage = overallMatchPercentage;
    }

    public String getReadinessStatus() {
        return readinessStatus;
    }

    public void setReadinessStatus(String readinessStatus) {
        this.readinessStatus = readinessStatus;
    }

    public String getReadinessBadgeColor() {
        return readinessBadgeColor;
    }

    public void setReadinessBadgeColor(String readinessBadgeColor) {
        this.readinessBadgeColor = readinessBadgeColor;
    }

    public int getTotalRoleSkills() {
        return totalRoleSkills;
    }

    public void setTotalRoleSkills(int totalRoleSkills) {
        this.totalRoleSkills = totalRoleSkills;
    }

    public int getMatchedSkillsCount() {
        return matchedSkillsCount;
    }

    public void setMatchedSkillsCount(int matchedSkillsCount) {
        this.matchedSkillsCount = matchedSkillsCount;
    }

    public int getMissingSkillsCount() {
        return missingSkillsCount;
    }

    public void setMissingSkillsCount(int missingSkillsCount) {
        this.missingSkillsCount = missingSkillsCount;
    }

    public List<MatchedSkillDto> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<MatchedSkillDto> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<MissingSkillDto> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<MissingSkillDto> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public Map<String, Integer> getCategorySkillCounts() {
        return categorySkillCounts;
    }

    public void setCategorySkillCounts(Map<String, Integer> categorySkillCounts) {
        this.categorySkillCounts = categorySkillCounts;
    }

    public String getAiSummaryRecommendation() {
        return aiSummaryRecommendation;
    }

    public void setAiSummaryRecommendation(String aiSummaryRecommendation) {
        this.aiSummaryRecommendation = aiSummaryRecommendation;
    }
}
