package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.AddStudentSkillRequest;
import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.StudentSkillDto;
import com.skillgap.analyzer.entity.ProficiencyLevel;
import com.skillgap.analyzer.service.StudentSkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/skills")
@Tag(name = "Student Skills", description = "Endpoints for managing student skills and proficiency levels")
public class StudentSkillController {

    private final StudentSkillService studentSkillService;

    public StudentSkillController(StudentSkillService studentSkillService) {
        this.studentSkillService = studentSkillService;
    }

    @GetMapping
    @Operation(summary = "Get list of all skills added by current student")
    public ResponseEntity<ApiResponse<List<StudentSkillDto>>> getMySkills(Authentication authentication) {
        List<StudentSkillDto> skills = studentSkillService.getStudentSkills(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Student skills retrieved", skills));
    }

    @PostMapping
    @Operation(summary = "Add a new skill to student profile")
    public ResponseEntity<ApiResponse<StudentSkillDto>> addSkill(
            Authentication authentication,
            @Valid @RequestBody AddStudentSkillRequest request) {
        StudentSkillDto created = studentSkillService.addSkill(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Skill added successfully!", created), HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    @Operation(summary = "Add or update multiple skills at once (used during student onboarding)")
    public ResponseEntity<ApiResponse<List<StudentSkillDto>>> addSkillsBulk(
            Authentication authentication,
            @RequestBody List<AddStudentSkillRequest> requests) {
        List<StudentSkillDto> createdList = studentSkillService.addSkillsBulk(authentication.getName(), requests);
        return ResponseEntity.ok(ApiResponse.success("Skills added successfully!", createdList));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update proficiency level and experience for a student skill")
    public ResponseEntity<ApiResponse<StudentSkillDto>> updateSkill(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam(required = false) ProficiencyLevel proficiency,
            @RequestParam(required = false) Integer yearsOfExperience) {
        StudentSkillDto updated = studentSkillService.updateSkill(authentication.getName(), id, proficiency, yearsOfExperience);
        return ResponseEntity.ok(ApiResponse.success("Skill updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a skill from student profile")
    public ResponseEntity<ApiResponse<String>> deleteSkill(
            Authentication authentication,
            @PathVariable Long id) {
        studentSkillService.deleteSkill(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Skill deleted successfully", null));
    }
}
