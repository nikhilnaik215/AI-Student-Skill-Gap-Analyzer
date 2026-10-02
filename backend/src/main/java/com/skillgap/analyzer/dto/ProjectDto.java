package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.DifficultyLevel;
import java.util.ArrayList;
import java.util.List;

public class ProjectDto {

    private Long id;
    private String title;
    private String description;
    private DifficultyLevel difficulty;
    private String techStack;
    private String estimatedDuration;
    private String learningOutcomes;
    private String targetRoleTitle;
    private List<String> addressedSkills = new ArrayList<>();
    private int matchingMissingSkillsCount;

    public ProjectDto() {}

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public String getLearningOutcomes() {
        return learningOutcomes;
    }

    public void setLearningOutcomes(String learningOutcomes) {
        this.learningOutcomes = learningOutcomes;
    }

    public String getTargetRoleTitle() {
        return targetRoleTitle;
    }

    public void setTargetRoleTitle(String targetRoleTitle) {
        this.targetRoleTitle = targetRoleTitle;
    }

    public List<String> getAddressedSkills() {
        return addressedSkills;
    }

    public void setAddressedSkills(List<String> addressedSkills) {
        this.addressedSkills = addressedSkills;
    }

    public int getMatchingMissingSkillsCount() {
        return matchingMissingSkillsCount;
    }

    public void setMatchingMissingSkillsCount(int matchingMissingSkillsCount) {
        this.matchingMissingSkillsCount = matchingMissingSkillsCount;
    }
}
