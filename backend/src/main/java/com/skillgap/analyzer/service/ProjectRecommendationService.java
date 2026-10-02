package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.ProjectDto;
import com.skillgap.analyzer.dto.SkillGapAnalysisResponse;
import com.skillgap.analyzer.entity.ProjectRecommendation;
import com.skillgap.analyzer.entity.Skill;
import com.skillgap.analyzer.repository.ProjectRecommendationRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectRecommendationService {

    private final ProjectRecommendationRepository projectRepository;
    private final SkillGapAnalysisService analysisService;

    public ProjectRecommendationService(
            ProjectRecommendationRepository projectRepository,
            SkillGapAnalysisService analysisService) {
        this.projectRepository = projectRepository;
        this.analysisService = analysisService;
    }

    public List<ProjectDto> getRecommendedProjectsForStudent(String email) {
        SkillGapAnalysisResponse analysis = analysisService.analyzeForTargetRole(email);

        Set<Long> missingSkillIds = analysis.getMissingSkills().stream()
                .map(s -> s.getSkillId())
                .collect(Collectors.toSet());

        List<ProjectRecommendation> allProjects = projectRepository.findAll();

        List<ProjectDto> results = new ArrayList<>();

        for (ProjectRecommendation project : allProjects) {
            ProjectDto dto = mapToDto(project);

            // Count how many missing skills this project helps bridge
            int matchingMissing = 0;
            for (Skill s : project.getTargetSkills()) {
                if (missingSkillIds.contains(s.getId())) {
                    matchingMissing++;
                }
            }
            dto.setMatchingMissingSkillsCount(matchingMissing);

            // If target role matches or it covers at least 1 missing skill
            boolean isRoleMatch = (project.getTargetRole() != null &&
                    project.getTargetRole().getId().equals(analysis.getJobRoleId()));

            if (isRoleMatch || matchingMissing > 0) {
                results.add(dto);
            }
        }

        // Sort: projects matching the most missing skills first
        results.sort((a, b) -> Integer.compare(b.getMatchingMissingSkillsCount(), a.getMatchingMissingSkillsCount()));

        // If no specifically matching projects, return all projects
        if (results.isEmpty()) {
            return getAllProjects();
        }

        return results;
    }

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ProjectDto mapToDto(ProjectRecommendation p) {
        ProjectDto dto = new ProjectDto();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setDescription(p.getDescription());
        dto.setDifficulty(p.getDifficulty());
        dto.setTechStack(p.getTechStack());
        dto.setEstimatedDuration(p.getEstimatedDuration());
        dto.setLearningOutcomes(p.getLearningOutcomes());
        if (p.getTargetRole() != null) {
            dto.setTargetRoleTitle(p.getTargetRole().getTitle());
        }
        dto.setAddressedSkills(p.getTargetSkills().stream().map(Skill::getName).collect(Collectors.toList()));
        return dto;
    }
}
