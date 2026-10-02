package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ApiResponse;
import com.skillgap.analyzer.dto.SkillDto;
import com.skillgap.analyzer.entity.SkillCategory;
import com.skillgap.analyzer.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@Tag(name = "Skills Catalog", description = "Endpoints for searching and listing industry skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    @Operation(summary = "Get skills catalog with optional search query or category filter")
    public ResponseEntity<ApiResponse<List<SkillDto>>> getSkills(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) SkillCategory category) {
        List<SkillDto> skills;
        if (category != null) {
            skills = skillService.getSkillsByCategory(category);
        } else if (search != null && !search.isBlank()) {
            skills = skillService.searchSkills(search);
        } else {
            skills = skillService.getAllSkills();
        }
        return ResponseEntity.ok(ApiResponse.success("Skills retrieved", skills));
    }

    @PostMapping
    @Operation(summary = "Add a new skill to the catalog")
    public ResponseEntity<ApiResponse<SkillDto>> createSkill(@RequestBody SkillDto dto) {
        SkillDto created = skillService.createSkill(dto);
        return new ResponseEntity<>(ApiResponse.success("Skill created", created), HttpStatus.CREATED);
    }
}
