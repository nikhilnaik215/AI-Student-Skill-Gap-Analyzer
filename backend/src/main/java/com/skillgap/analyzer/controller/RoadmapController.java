package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.RoadmapResponse;
import com.skillgap.analyzer.service.AiRoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@Tag(name = "AI Roadmap", description = "Endpoints for generating and viewing AI-powered learning roadmaps")
public class RoadmapController {

    private final AiRoadmapService roadmapService;

    public RoadmapController(AiRoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate a personalized week-by-week learning roadmap for current missing skills")
    public ResponseEntity<ApiResponse<RoadmapResponse>> generateRoadmap(Authentication authentication) {
        RoadmapResponse response = roadmapService.generateRoadmap(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("AI Learning Roadmap generated successfully!", response));
    }

    @GetMapping("/my-roadmaps")
    @Operation(summary = "Get list of all saved roadmaps for the logged-in student")
    public ResponseEntity<ApiResponse<List<RoadmapResponse>>> getMyRoadmaps(Authentication authentication) {
        List<RoadmapResponse> list = roadmapService.getMyRoadmaps(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Roadmaps retrieved", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed roadmap by ID")
    public ResponseEntity<ApiResponse<RoadmapResponse>> getRoadmapById(
            Authentication authentication,
            @PathVariable Long id) {
        RoadmapResponse response = roadmapService.getRoadmapById(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Roadmap details retrieved", response));
    }
}
