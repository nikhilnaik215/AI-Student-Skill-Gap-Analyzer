package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.AdminStatsDto;
import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.JobRoleDto;
import com.skillgap.analyzer.dto.JobRoleSkillDto;
import com.skillgap.analyzer.dto.StudentSummaryDto;
import com.skillgap.analyzer.entity.JobRole;
import com.skillgap.analyzer.entity.JobRoleSkill;
import com.skillgap.analyzer.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@Tag(name = "Admin Management", description = "Endpoints restricted to administrative users for analytics, student tracking, and catalog management")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get overall platform analytics and breakdown")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        AdminStatsDto stats = adminService.getStats();
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", stats));
    }

    @GetMapping("/students")
    @Operation(summary = "Get all registered students and their skill count & target role")
    public ResponseEntity<ApiResponse<List<StudentSummaryDto>>> getAllStudents() {
        List<StudentSummaryDto> list = adminService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", list));
    }

    @PostMapping("/roles")
    @Operation(summary = "Create a new career role")
    public ResponseEntity<ApiResponse<JobRole>> createRole(@RequestBody JobRoleDto dto) {
        JobRole role = adminService.createJobRole(dto);
        return new ResponseEntity<>(ApiResponse.success("Job role created successfully", role), HttpStatus.CREATED);
    }

    @PostMapping("/roles/{roleId}/skills")
    @Operation(summary = "Add or update required skill for a job role")
    public ResponseEntity<ApiResponse<JobRoleSkill>> addSkillToRole(
            @PathVariable Long roleId,
            @RequestBody JobRoleSkillDto dto) {
        JobRoleSkill jrs = adminService.addSkillToJobRole(roleId, dto);
        return ResponseEntity.ok(ApiResponse.success("Skill assigned to role successfully", jrs));
    }

    @DeleteMapping("/roles/{roleId}")
    @Operation(summary = "Delete a career role and its skill requirements")
    public ResponseEntity<ApiResponse<String>> deleteRole(@PathVariable Long roleId) {
        adminService.deleteJobRole(roleId);
        return ResponseEntity.ok(ApiResponse.success("Job role deleted successfully", null));
    }
}
