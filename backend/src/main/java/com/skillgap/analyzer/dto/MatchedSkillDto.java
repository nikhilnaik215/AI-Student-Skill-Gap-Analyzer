package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.Importance;
import com.skillgap.analyzer.entity.ProficiencyLevel;
import com.skillgap.analyzer.entity.SkillCategory;

public class MatchedSkillDto {

    private Long skillId;
    private String skillName;
    private SkillCategory category;
    private ProficiencyLevel studentProficiency;
    private ProficiencyLevel requiredProficiency;
    private Importance importance;
    private boolean proficiencyMet;
    private String gapNote;

    public MatchedSkillDto() {}

    public MatchedSkillDto(Long skillId, String skillName, SkillCategory category,
                           ProficiencyLevel studentProficiency, ProficiencyLevel requiredProficiency,
                           Importance importance, boolean proficiencyMet, String gapNote) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.studentProficiency = studentProficiency;
        this.requiredProficiency = requiredProficiency;
        this.importance = importance;
        this.proficiencyMet = proficiencyMet;
        this.gapNote = gapNote;
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

    public ProficiencyLevel getStudentProficiency() {
        return studentProficiency;
    }

    public void setStudentProficiency(ProficiencyLevel studentProficiency) {
        this.studentProficiency = studentProficiency;
    }

    public ProficiencyLevel getRequiredProficiency() {
        return requiredProficiency;
    }

    public void setRequiredProficiency(ProficiencyLevel requiredProficiency) {
        this.requiredProficiency = requiredProficiency;
    }

    public Importance getImportance() {
        return importance;
    }

    public void setImportance(Importance importance) {
        this.importance = importance;
    }

    public boolean isProficiencyMet() {
        return proficiencyMet;
    }

    public void setProficiencyMet(boolean proficiencyMet) {
        this.proficiencyMet = proficiencyMet;
    }

    public String getGapNote() {
        return gapNote;
    }

    public void setGapNote(String gapNote) {
        this.gapNote = gapNote;
    }
}
