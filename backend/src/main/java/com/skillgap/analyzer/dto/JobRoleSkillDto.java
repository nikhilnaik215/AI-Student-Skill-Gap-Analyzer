package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.Importance;
import com.skillgap.analyzer.entity.ProficiencyLevel;
import com.skillgap.analyzer.entity.SkillCategory;

public class JobRoleSkillDto {

    private Long id;
    private Long skillId;
    private String skillName;
    private SkillCategory skillCategory;
    private Importance importance;
    private ProficiencyLevel minProficiency;
    private Integer weight;

    public JobRoleSkillDto() {}

    public JobRoleSkillDto(Long id, Long skillId, String skillName, SkillCategory skillCategory, Importance importance, ProficiencyLevel minProficiency, Integer weight) {
        this.id = id;
        this.skillId = skillId;
        this.skillName = skillName;
        this.skillCategory = skillCategory;
        this.importance = importance;
        this.minProficiency = minProficiency;
        this.weight = weight;
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

    public SkillCategory getSkillCategory() {
        return skillCategory;
    }

    public void setSkillCategory(SkillCategory skillCategory) {
        this.skillCategory = skillCategory;
    }

    public Importance getImportance() {
        return importance;
    }

    public void setImportance(Importance importance) {
        this.importance = importance;
    }

    public ProficiencyLevel getMinProficiency() {
        return minProficiency;
    }

    public void setMinProficiency(ProficiencyLevel minProficiency) {
        this.minProficiency = minProficiency;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }
}
