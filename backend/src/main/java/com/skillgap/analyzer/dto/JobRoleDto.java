package com.skillgap.analyzer.dto;

import com.skillgap.analyzer.entity.IndustryDemand;
import java.util.ArrayList;
import java.util.List;

public class JobRoleDto {

    private Long id;
    private String title;
    private String description;
    private IndustryDemand industryDemand;
    private String avgSalary;
    private String icon;
    private int requiredSkillsCount;
    private List<JobRoleSkillDto> requiredSkills = new ArrayList<>();

    public JobRoleDto() {}

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

    public IndustryDemand getIndustryDemand() {
        return industryDemand;
    }

    public void setIndustryDemand(IndustryDemand industryDemand) {
        this.industryDemand = industryDemand;
    }

    public String getAvgSalary() {
        return avgSalary;
    }

    public void setAvgSalary(String avgSalary) {
        this.avgSalary = avgSalary;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getRequiredSkillsCount() {
        return requiredSkillsCount;
    }

    public void setRequiredSkillsCount(int requiredSkillsCount) {
        this.requiredSkillsCount = requiredSkillsCount;
    }

    public List<JobRoleSkillDto> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<JobRoleSkillDto> requiredSkills) {
        this.requiredSkills = requiredSkills;
        this.requiredSkillsCount = (requiredSkills != null) ? requiredSkills.size() : 0;
    }
}
