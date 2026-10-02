package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.DifficultyLevel;

public class LearningResourceDto {

    private Long id;
    private Long skillId;
    private String skillName;
    private String title;
    private String topic;
    private String channelName;
    private String youtubeUrl;
    private String thumbnailUrl;
    private String duration;
    private DifficultyLevel difficulty;

    public LearningResourceDto() {}

    public LearningResourceDto(Long id, Long skillId, String skillName, String title, String topic, String channelName, String youtubeUrl, String duration, DifficultyLevel difficulty) {
        this.id = id;
        this.skillId = skillId;
        this.skillName = skillName;
        this.title = title;
        this.topic = topic;
        this.channelName = channelName;
        this.youtubeUrl = youtubeUrl;
        this.duration = duration;
        this.difficulty = difficulty;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public String getYoutubeUrl() {
        return youtubeUrl;
    }

    public void setYoutubeUrl(String youtubeUrl) {
        this.youtubeUrl = youtubeUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }
}
