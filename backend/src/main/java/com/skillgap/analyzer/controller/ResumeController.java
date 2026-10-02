package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.ResumeDto;
import com.skillgap.analyzer.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/resume")
@Tag(name = "Resume Builder", description = "Endpoints for creating, updating, and auto-populating student resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping
    @Operation(summary = "Get current student's resume data")
    public ResponseEntity<ApiResponse<ResumeDto>> getResume(Authentication authentication) {
        ResumeDto resume = resumeService.getResume(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Resume retrieved successfully", resume));
    }

    @PutMapping
    @Operation(summary = "Save or update current student's resume data")
    public ResponseEntity<ApiResponse<ResumeDto>> saveResume(
            Authentication authentication,
            @RequestBody ResumeDto dto) {
        ResumeDto updated = resumeService.saveResume(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Resume saved successfully!", updated));
    }

    @PostMapping("/auto-populate")
    @Operation(summary = "Auto-populate resume with profile data and declared skills")
    public ResponseEntity<ApiResponse<ResumeDto>> autoPopulate(Authentication authentication) {
        ResumeDto populated = resumeService.populateFromProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Resume successfully populated from your student profile and skills!", populated));
    }
}
