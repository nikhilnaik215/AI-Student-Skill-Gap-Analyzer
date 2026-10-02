package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.SkillCategory;

public class SkillDto {

    private Long id;
    private String name;
    private SkillCategory category;
    private String description;

    public SkillDto() {}

    public SkillDto(Long id, String name, SkillCategory category, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SkillCategory getCategory() {
        return category;
    }

    public void setCategory(SkillCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
