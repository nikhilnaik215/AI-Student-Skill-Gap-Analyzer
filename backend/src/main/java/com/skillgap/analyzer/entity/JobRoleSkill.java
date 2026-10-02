package com.skillgap.analyzer.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(
    name = "job_role_skills",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_role_id", "skill_id"})
    }
)
public class JobRoleSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private JobRole jobRole;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Importance importance = Importance.REQUIRED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProficiencyLevel minProficiency = ProficiencyLevel.INTERMEDIATE;

    private Integer weight = 3;

    public JobRoleSkill() {}

    public JobRoleSkill(JobRole jobRole, Skill skill, Importance importance, ProficiencyLevel minProficiency, Integer weight) {
        this.jobRole = jobRole;
        this.skill = skill;
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

    public JobRole getJobRole() {
        return jobRole;
    }

    public void setJobRole(JobRole jobRole) {
        this.jobRole = jobRole;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
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
