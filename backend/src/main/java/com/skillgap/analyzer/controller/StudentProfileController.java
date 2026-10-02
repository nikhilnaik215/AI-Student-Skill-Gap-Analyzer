package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.StudentProfileDto;
import com.skillgap.analyzer.service.StudentProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/profile")
@Tag(name = "Student Profile", description = "Endpoints for managing student profile information and target role")
public class StudentProfileController {

    private final StudentProfileService profileService;

    public StudentProfileController(StudentProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @Operation(summary = "Get current authenticated student's profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile(Authentication authentication) {
        StudentProfileDto profile = profileService.getProfileByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PutMapping
    @Operation(summary = "Update current authenticated student's profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(
            Authentication authentication,
            @RequestBody StudentProfileDto dto) {
        StudentProfileDto updated = profileService.updateProfile(authentication.getName(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/target-role/{roleId}")
    @Operation(summary = "Change target career role")
    public ResponseEntity<ApiResponse<StudentProfileDto>> setTargetRole(
            Authentication authentication,
            @PathVariable Long roleId) {
        StudentProfileDto updated = profileService.setTargetRole(authentication.getName(), roleId);
        return ResponseEntity.ok(ApiResponse.success("Target career role updated successfully!", updated));
    }

    @PutMapping("/onboarding-complete")
    @Operation(summary = "Mark student skill onboarding as completed")
    public ResponseEntity<ApiResponse<StudentProfileDto>> completeOnboarding(Authentication authentication) {
        StudentProfileDto updated = profileService.completeOnboarding(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Onboarding marked as completed!", updated));
    }
}
