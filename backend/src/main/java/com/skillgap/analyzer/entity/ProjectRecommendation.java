package com.skillgap.analyzer.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "project_recommendations")
public class ProjectRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000, nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty = DifficultyLevel.INTERMEDIATE;

    private String techStack;

    private String estimatedDuration;

    @Column(length = 2000)
    private String learningOutcomes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_role_id")
    private JobRole targetRole;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "project_target_skills",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> targetSkills = new HashSet<>();

    public ProjectRecommendation() {}

    public ProjectRecommendation(String title, String description, DifficultyLevel difficulty, String techStack, String estimatedDuration, String learningOutcomes, JobRole targetRole) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.techStack = techStack;
        this.estimatedDuration = estimatedDuration;
        this.learningOutcomes = learningOutcomes;
        this.targetRole = targetRole;
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

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public String getLearningOutcomes() {
        return learningOutcomes;
    }

    public void setLearningOutcomes(String learningOutcomes) {
        this.learningOutcomes = learningOutcomes;
    }

    public JobRole getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(JobRole targetRole) {
        this.targetRole = targetRole;
    }

    public Set<Skill> getTargetSkills() {
        return targetSkills;
    }

    public void setTargetSkills(Set<Skill> targetSkills) {
        this.targetSkills = targetSkills;
    }
}
