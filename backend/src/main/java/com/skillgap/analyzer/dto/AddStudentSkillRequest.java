package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.ProficiencyLevel;
import jakarta.validation.constraints.NotNull;

public class AddStudentSkillRequest {

    private Long skillId;
    private String customSkillName;
    private String category;

    @NotNull(message = "Proficiency level is required (BEGINNER, INTERMEDIATE, or ADVANCED)")
    private ProficiencyLevel proficiency = ProficiencyLevel.INTERMEDIATE;

    private Integer yearsOfExperience = 1;

    public AddStudentSkillRequest() {}

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getCustomSkillName() {
        return customSkillName;
    }

    public void setCustomSkillName(String customSkillName) {
        this.customSkillName = customSkillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
