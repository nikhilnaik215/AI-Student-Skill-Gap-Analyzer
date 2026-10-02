package com.skillgap.analyzer.controller;

import com.skillgap.analyzer.dto.ResumeAnalysisRequest;
import com.skillgap.analyzer.dto.ResumeAnalysisResponse;
import com.skillgap.analyzer.service.ResumeAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume-analyzer")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeAnalysisController(ResumeAnalysisService resumeAnalysisService) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(@Valid @RequestBody ResumeAnalysisRequest request) {
        ResumeAnalysisResponse response = resumeAnalysisService.analyzeResume(request);
        return ResponseEntity.ok(response);
    }
}
