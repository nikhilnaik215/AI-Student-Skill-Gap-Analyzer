package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.ProjectDto;
import com.skillgap.analyzer.service.ProjectRecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Recommendations", description = "Endpoints for project recommendations that bridge missing skills")
public class ProjectController {

    private final ProjectRecommendationService projectService;

    public ProjectController(ProjectRecommendationService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get tailored project recommendations addressing current missing skills")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getRecommendedProjects(Authentication authentication) {
        List<ProjectDto> projects = projectService.getRecommendedProjectsForStudent(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Recommended projects retrieved", projects));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all available portfolio project templates")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getAllProjects() {
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success("All projects retrieved", projects));
    }
}
