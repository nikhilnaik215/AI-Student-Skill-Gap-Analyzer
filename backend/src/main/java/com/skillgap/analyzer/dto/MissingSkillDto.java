package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.Importance;
import com.skillgap.analyzer.entity.ProficiencyLevel;
import com.skillgap.analyzer.entity.SkillCategory;

public class MissingSkillDto {

    private Long skillId;
    private String skillName;
    private SkillCategory category;
    private Importance importance;
    private ProficiencyLevel targetProficiency;
    private Integer weight;
    private String priority; // HIGH_PRIORITY or RECOMMENDED

    public MissingSkillDto() {}

    public MissingSkillDto(Long skillId, String skillName, SkillCategory category,
                           Importance importance, ProficiencyLevel targetProficiency,
                           Integer weight, String priority) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.importance = importance;
        this.targetProficiency = targetProficiency;
        this.weight = weight;
        this.priority = priority;
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

    public SkillCategory getCategory() {
        return category;
    }

    public void setCategory(SkillCategory category) {
        this.category = category;
    }

    public Importance getImportance() {
        return importance;
    }

    public void setImportance(Importance importance) {
        this.importance = importance;
    }

    public ProficiencyLevel getTargetProficiency() {
        return targetProficiency;
    }

    public void setTargetProficiency(ProficiencyLevel targetProficiency) {
        this.targetProficiency = targetProficiency;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
