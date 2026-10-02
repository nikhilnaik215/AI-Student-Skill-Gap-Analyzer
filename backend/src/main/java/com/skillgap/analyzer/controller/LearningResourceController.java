package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.LearningResourceDto;
import com.skillgap.analyzer.service.LearningResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@Tag(name = "Learning Resources", description = "Endpoints for retrieving verified YouTube tutorials mapped to missing skills")
public class LearningResourceController {

    private final LearningResourceService resourceService;

    public LearningResourceController(LearningResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    @Operation(summary = "Get verified educational video resources with optional skill filter")
    public ResponseEntity<ApiResponse<List<LearningResourceDto>>> getResources(
            @RequestParam(required = false) String skill) {
        List<LearningResourceDto> list = resourceService.getResourcesBySkillName(skill);
        return ResponseEntity.ok(ApiResponse.success("Learning resources retrieved", list));
    }

    @GetMapping("/skill/{skillId}")
    @Operation(summary = "Get learning resources specifically mapped to a skill ID")
    public ResponseEntity<ApiResponse<List<LearningResourceDto>>> getResourcesBySkillId(@PathVariable Long skillId) {
        List<LearningResourceDto> list = resourceService.getResourcesBySkillId(skillId);
        return ResponseEntity.ok(ApiResponse.success("Learning resources for skill retrieved", list));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Add a new verified YouTube learning resource")
    public ResponseEntity<ApiResponse<LearningResourceDto>> addResource(@RequestBody LearningResourceDto dto) {
        LearningResourceDto created = resourceService.addResource(dto);
        return new ResponseEntity<>(ApiResponse.success("Learning resource added successfully", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete a learning resource")
    public ResponseEntity<ApiResponse<String>> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Learning resource deleted", null));
    }
}
