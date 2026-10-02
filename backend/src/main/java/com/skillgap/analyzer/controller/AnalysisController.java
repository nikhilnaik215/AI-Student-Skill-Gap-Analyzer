package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.SkillGapAnalysisResponse;
import com.skillgap.analyzer.service.SkillGapAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@Tag(name = "Skill Gap Analysis", description = "Endpoints for analyzing skill gaps, computing match percentages, and readiness metrics")
public class AnalysisController {

    private final SkillGapAnalysisService analysisService;

    public AnalysisController(SkillGapAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/target")
    @Operation(summary = "Perform skill gap analysis for the logged-in student's selected target role")
    public ResponseEntity<ApiResponse<SkillGapAnalysisResponse>> analyzeTargetRole(Authentication authentication) {
        SkillGapAnalysisResponse response = analysisService.analyzeForTargetRole(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis computed successfully", response));
    }

    @GetMapping("/role/{roleId}")
    @Operation(summary = "Perform skill gap analysis for the logged-in student against a specified career role")
    public ResponseEntity<ApiResponse<SkillGapAnalysisResponse>> analyzeSpecificRole(
            Authentication authentication,
            @PathVariable Long roleId) {
        SkillGapAnalysisResponse response = analysisService.analyzeForRole(authentication.getName(), roleId);
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis computed successfully for role ID: " + roleId, response));
    }
}
