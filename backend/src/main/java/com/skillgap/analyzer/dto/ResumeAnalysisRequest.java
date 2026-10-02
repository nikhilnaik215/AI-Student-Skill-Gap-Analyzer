package com.skillgap.analyzer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ResumeAnalysisRequest {

    @NotBlank(message = "Resume content is required for analysis")
    private String resumeText;

    @NotNull(message = "Target job role ID is required")
    private Long jobRoleId;

    private String fileName;

    public ResumeAnalysisRequest() {}

    public ResumeAnalysisRequest(String resumeText, Long jobRoleId, String fileName) {
        this.resumeText = resumeText;
        this.jobRoleId = jobRoleId;
        this.fileName = fileName;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public Long getJobRoleId() {
        return jobRoleId;
    }

    public void setJobRoleId(Long jobRoleId) {
        this.jobRoleId = jobRoleId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
