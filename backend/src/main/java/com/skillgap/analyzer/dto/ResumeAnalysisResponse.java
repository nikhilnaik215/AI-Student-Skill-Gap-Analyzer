package com.skillgap.analyzer.dto;

import java.util.ArrayList;
import java.util.List;

public class ResumeAnalysisResponse {

    private String targetRoleTitle;
    private double matchPercentage;
    private int totalRoleSkills;
    private int matchedSkillsCount;
    private int missingSkillsCount;
    private String overallFeedback;
    private String matchVerdict; // e.g., "Strong Match", "Moderate Match", "Needs Improvement"

    private List<String> detectedSkills = new ArrayList<>();
    private List<MatchedSkillDto> matchedSkills = new ArrayList<>();
    private List<MissingSkillDto> missingSkills = new ArrayList<>();
    private List<SectionCritique> sectionCritiques = new ArrayList<>();
    private List<String> improvementSuggestions = new ArrayList<>();
    private List<ProjectDto> recommendedProjects = new ArrayList<>();

    public ResumeAnalysisResponse() {}

    public static class SectionCritique {
        private String sectionName; // e.g. "Professional Summary", "Projects", "Work Experience", "Education", "Skills Formatting"
        private int score; // 0 - 100
        private String status; // "Strong", "Average", "Weak", "Missing"
        private String feedback;

        public SectionCritique() {}

        public SectionCritique(String sectionName, int score, String status, String feedback) {
            this.sectionName = sectionName;
            this.score = score;
            this.status = status;
            this.feedback = feedback;
        }

        public String getSectionName() {
            return sectionName;
        }

        public void setSectionName(String sectionName) {
            this.sectionName = sectionName;
        }

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
        }
    }

    // Getters and Setters
    public String getTargetRoleTitle() {
        return targetRoleTitle;
    }

    public void setTargetRoleTitle(String targetRoleTitle) {
        this.targetRoleTitle = targetRoleTitle;
    }

    public double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(double matchPercentage) {
        this.matchPercentage = matchPercentage;
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

    public String getOverallFeedback() {
        return overallFeedback;
    }

    public void setOverallFeedback(String overallFeedback) {
        this.overallFeedback = overallFeedback;
    }

    public String getMatchVerdict() {
        return matchVerdict;
    }

    public void setMatchVerdict(String matchVerdict) {
        this.matchVerdict = matchVerdict;
    }

    public List<String> getDetectedSkills() {
        return detectedSkills;
    }

    public void setDetectedSkills(List<String> detectedSkills) {
        this.detectedSkills = detectedSkills;
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

    public List<SectionCritique> getSectionCritiques() {
        return sectionCritiques;
    }

    public void setSectionCritiques(List<SectionCritique> sectionCritiques) {
        this.sectionCritiques = sectionCritiques;
    }

    public List<String> getImprovementSuggestions() {
        return improvementSuggestions;
    }

    public void setImprovementSuggestions(List<String> improvementSuggestions) {
        this.improvementSuggestions = improvementSuggestions;
    }

    public List<ProjectDto> getRecommendedProjects() {
        return recommendedProjects;
    }

    public void setRecommendedProjects(List<ProjectDto> recommendedProjects) {
        this.recommendedProjects = recommendedProjects;
    }
}
