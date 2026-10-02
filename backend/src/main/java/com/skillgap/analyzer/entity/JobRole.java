package com.skillgap.analyzer.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "job_roles")
public class JobRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IndustryDemand industryDemand = IndustryDemand.HIGH;

    private String avgSalary;

    private String icon;

    public JobRole() {}

    public JobRole(String title, String description, IndustryDemand industryDemand, String avgSalary, String icon) {
        this.title = title;
        this.description = description;
        this.industryDemand = industryDemand;
        this.avgSalary = avgSalary;
        this.icon = icon;
    }

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
}
