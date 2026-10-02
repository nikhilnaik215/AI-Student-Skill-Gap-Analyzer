package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.ProficiencyLevel;
import com.skillgap.analyzer.entity.SkillCategory;

public class StudentSkillDto {

    private Long id;
    private Long skillId;
    private String skillName;
    private SkillCategory skillCategory;
    private ProficiencyLevel proficiency;
    private Integer yearsOfExperience;

    public StudentSkillDto() {}

    public StudentSkillDto(Long id, Long skillId, String skillName, SkillCategory skillCategory, ProficiencyLevel proficiency, Integer yearsOfExperience) {
        this.id = id;
        this.skillId = skillId;
        this.skillName = skillName;
        this.skillCategory = skillCategory;
        this.proficiency = proficiency;
        this.yearsOfExperience = yearsOfExperience;
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

    public ProficiencyLevel getProficiency() {
        return proficiency;
    }

    public void setProficiency(ProficiencyLevel proficiency) {
        this.proficiency = proficiency;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}
