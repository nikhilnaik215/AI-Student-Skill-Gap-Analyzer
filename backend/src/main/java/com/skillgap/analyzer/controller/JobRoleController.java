package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.JobRoleDto;
import com.skillgap.analyzer.service.JobRoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Career Roles", description = "Endpoints for exploring career paths and their required skills")
public class JobRoleController {

    private final JobRoleService jobRoleService;

    public JobRoleController(JobRoleService jobRoleService) {
        this.jobRoleService = jobRoleService;
    }

    @GetMapping
    @Operation(summary = "Get all available career roles (Java Developer, Web Developer, Data Analyst, Data Scientist, etc.)")
    public ResponseEntity<ApiResponse<List<JobRoleDto>>> getAllRoles() {
        List<JobRoleDto> roles = jobRoleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success("Career roles retrieved", roles));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get career role details with list of required and preferred skills")
    public ResponseEntity<ApiResponse<JobRoleDto>> getRoleById(@PathVariable Long id) {
        JobRoleDto role = jobRoleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.success("Career role details retrieved", role));
    }
}
