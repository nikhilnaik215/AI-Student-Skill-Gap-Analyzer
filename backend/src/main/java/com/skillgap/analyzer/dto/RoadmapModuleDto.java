package com.skillgap.analyzer.dto;

import java.util.ArrayList;
import java.util.List;

public class RoadmapModuleDto {

    private int week;
    private String title;
    private String focusSkill;
    private List<String> keyTopics = new ArrayList<>();
    private List<String> learningObjectives = new ArrayList<>();
    private String suggestedPractice;
    private List<String> recommendedResources = new ArrayList<>();

    public RoadmapModuleDto() {}

    public RoadmapModuleDto(int week, String title, String focusSkill,
                            List<String> keyTopics, List<String> learningObjectives,
                            String suggestedPractice, List<String> recommendedResources) {
        this.week = week;
        this.title = title;
        this.focusSkill = focusSkill;
        this.keyTopics = keyTopics;
        this.learningObjectives = learningObjectives;
        this.suggestedPractice = suggestedPractice;
        this.recommendedResources = recommendedResources;
    }

    public int getWeek() {
        return week;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFocusSkill() {
        return focusSkill;
    }

    public void setFocusSkill(String focusSkill) {
        this.focusSkill = focusSkill;
    }

    public List<String> getKeyTopics() {
        return keyTopics;
    }

    public void setKeyTopics(List<String> keyTopics) {
        this.keyTopics = keyTopics;
    }

    public List<String> getLearningObjectives() {
        return learningObjectives;
    }

    public void setLearningObjectives(List<String> learningObjectives) {
        this.learningObjectives = learningObjectives;
    }

    public String getSuggestedPractice() {
        return suggestedPractice;
    }

    public void setSuggestedPractice(String suggestedPractice) {
        this.suggestedPractice = suggestedPractice;
    }

    public List<String> getRecommendedResources() {
        return recommendedResources;
    }

    public void setRecommendedResources(List<String> recommendedResources) {
        this.recommendedResources = recommendedResources;
    }
}
