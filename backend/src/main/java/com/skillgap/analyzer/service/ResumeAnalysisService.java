package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.*;
import com.skillgap.analyzer.entity.*;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.JobRoleRepository;
import com.skillgap.analyzer.repository.JobRoleSkillRepository;
import com.skillgap.analyzer.repository.ProjectRecommendationRepository;
import com.skillgap.analyzer.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResumeAnalysisService {

    private final JobRoleRepository jobRoleRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;
    private final SkillRepository skillRepository;
    private final ProjectRecommendationRepository projectRepository;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    public ResumeAnalysisService(
            JobRoleRepository jobRoleRepository,
            JobRoleSkillRepository jobRoleSkillRepository,
            SkillRepository skillRepository,
            ProjectRecommendationRepository projectRepository) {
        this.jobRoleRepository = jobRoleRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
    }

    public ResumeAnalysisResponse analyzeResume(ResumeAnalysisRequest request) {
        JobRole role = jobRoleRepository.findById(request.getJobRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with ID: " + request.getJobRoleId()));

        String text = (request.getResumeText() != null) ? request.getResumeText() : "";
        String lowerText = text.toLowerCase(Locale.ROOT);

        // 1. Fetch catalog skills & role skills
        List<Skill> allSkills = skillRepository.findAll();
        List<JobRoleSkill> roleSkills = jobRoleSkillRepository.findAllWithSkillByJobRoleId(role.getId());

        // 2. Detect catalog skills present in resume text
        Set<Long> detectedSkillIds = new HashSet<>();
        List<String> detectedSkillNames = new ArrayList<>();

        for (Skill s : allSkills) {
            if (isSkillPresentInText(lowerText, s.getName())) {
                detectedSkillIds.add(s.getId());
                detectedSkillNames.add(s.getName());
            }
        }

        // 3. Compute Role Skill Match & Gaps
        List<MatchedSkillDto> matchedList = new ArrayList<>();
        List<MissingSkillDto> missingList = new ArrayList<>();
        Set<Long> missingSkillIds = new HashSet<>();

        double totalMaxPoints = 0.0;
        double earnedPoints = 0.0;

        for (JobRoleSkill rSkill : roleSkills) {
            Skill skill = rSkill.getSkill();
            double importanceMultiplier = (rSkill.getImportance() == Importance.REQUIRED) ? 1.3 : 1.0;
            double maxSkillPoints = rSkill.getWeight() * importanceMultiplier;
            totalMaxPoints += maxSkillPoints;

            if (detectedSkillIds.contains(skill.getId())) {
                earnedPoints += maxSkillPoints;
                matchedList.add(new MatchedSkillDto(
                        skill.getId(),
                        skill.getName(),
                        skill.getCategory(),
                        ProficiencyLevel.INTERMEDIATE, // detected in resume
                        rSkill.getMinProficiency(),
                        rSkill.getImportance(),
                        true,
                        "Found in resume text (matches required " + rSkill.getMinProficiency() + ")"
                ));
            } else {
                missingSkillIds.add(skill.getId());
                String priority = (rSkill.getImportance() == Importance.REQUIRED) ? "HIGH_PRIORITY" : "RECOMMENDED";
                missingList.add(new MissingSkillDto(
                        skill.getId(),
                        skill.getName(),
                        skill.getCategory(),
                        rSkill.getImportance(),
                        rSkill.getMinProficiency(),
                        rSkill.getWeight(),
                        priority
                ));
            }
        }

        // Calculate transparent match percentage
        double matchPercentage = 0.0;
        if (totalMaxPoints > 0) {
            matchPercentage = Math.round((earnedPoints / totalMaxPoints) * 1000.0) / 10.0;
            if (matchPercentage > 100.0) matchPercentage = 100.0;
        }

        // Sort missing skills: HIGH_PRIORITY first, then by weight
        missingList.sort((a, b) -> {
            if (a.getPriority().equals(b.getPriority())) {
                return b.getWeight().compareTo(a.getWeight());
            }
            return a.getPriority().equals("HIGH_PRIORITY") ? -1 : 1;
        });

        // 4. Section Quality Critiques
        List<ResumeAnalysisResponse.SectionCritique> critiques = evaluateResumeSections(text, lowerText, role.getTitle());

        // 5. Constructive Suggestions
        List<String> suggestions = generateImprovementSuggestions(text, lowerText, missingList, role.getTitle(), matchPercentage);

        // 6. Recommended Projects covering missing skills or role
        List<ProjectDto> recommendedProjects = findProjectsForGaps(missingSkillIds, role.getId());

        // 7. Overall Verdict & Summary
        String verdict;
        String feedback;
        if (matchPercentage >= 75.0) {
            verdict = "Competitive Match";
            feedback = "Strong resume alignment for " + role.getTitle() + " (" + matchPercentage + "% match). Your resume clearly articulates core competencies. Focus on quantifying project achievements with measurable business impact metrics and adding production links/deployments.";
        } else if (matchPercentage >= 45.0) {
            verdict = "Moderate Match";
            feedback = "Promising foundation for " + role.getTitle() + " (" + matchPercentage + "% match). You have several relevant baseline skills, but key mandatory tools (" +
                    missingList.stream().limit(3).map(MissingSkillDto::getSkillName).collect(Collectors.joining(", ")) +
                    ") are unmentioned. Highlight coursework, add the recommended projects below, and tailor your bullet points to this role.";
        } else {
            verdict = "Needs Substantial Skill Alignment";
            feedback = "Significant skill and content gap identified for " + role.getTitle() + " (" + matchPercentage + "% match). Critical role prerequisites are absent from your resume text. Follow the recommended projects and roadmap modules to build practical proof of work before applying.";
        }

        ResumeAnalysisResponse response = new ResumeAnalysisResponse();
        response.setTargetRoleTitle(role.getTitle());
        response.setMatchPercentage(matchPercentage);
        response.setTotalRoleSkills(roleSkills.size());
        response.setMatchedSkillsCount(matchedList.size());
        response.setMissingSkillsCount(missingList.size());
        response.setMatchVerdict(verdict);
        response.setOverallFeedback(feedback);
        response.setDetectedSkills(detectedSkillNames);
        response.setMatchedSkills(matchedList);
        response.setMissingSkills(missingList);
        response.setSectionCritiques(critiques);
        response.setImprovementSuggestions(suggestions);
        response.setRecommendedProjects(recommendedProjects);

        return response;
    }

    private boolean isSkillPresentInText(String lowerText, String skillName) {
        String s = skillName.trim().toLowerCase(Locale.ROOT);

        // Handle special symbols: C++, C#, etc.
        if (s.equals("c++")) {
            return lowerText.contains("c++") || lowerText.contains("cpp");
        }
        if (s.equals("c#")) {
            return lowerText.contains("c#") || lowerText.contains("csharp");
        }
        if (s.equals("c")) {
            // Check standalone 'c' language mention like "c language" or "c/c++" or "\bc\b"
            Pattern p = Pattern.compile("(?i)(?:\\bc\\b|c/c\\+\\+|c\\s+programming|c\\s+language)");
            return p.matcher(lowerText).find();
        }
        if (s.equals("react")) {
            return lowerText.contains("react") || lowerText.contains("reactjs") || lowerText.contains("react.js");
        }
        if (s.equals("node.js") || s.equals("node")) {
            return lowerText.contains("node.js") || lowerText.contains("nodejs") || lowerText.contains("node");
        }
        if (s.equals("sql")) {
            return lowerText.contains("sql") || lowerText.contains("mysql") || lowerText.contains("postgres") || lowerText.contains("rdbms");
        }
        if (s.equals("microsoft excel") || s.equals("excel")) {
            return lowerText.contains("excel") || lowerText.contains("spreadsheet");
        }
        if (s.equals("data structures") || s.equals("data structures & algorithms")) {
            return lowerText.contains("data structure") || lowerText.contains("dsa") || lowerText.contains("algorithms");
        }

        // Generic token boundary match
        String escaped = Pattern.quote(s);
        Pattern pattern = Pattern.compile("\\b" + escaped + "\\b", Pattern.CASE_INSENSITIVE);
        return pattern.matcher(lowerText).find();
    }

    private List<ResumeAnalysisResponse.SectionCritique> evaluateResumeSections(String rawText, String lowerText, String roleTitle) {
        List<ResumeAnalysisResponse.SectionCritique> critiques = new ArrayList<>();

        // 1. Contact Information
        boolean hasEmail = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}").matcher(rawText).find();
        boolean hasPhone = Pattern.compile("(\\+?[0-9]{1,3}[-\\s]?)?\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}").matcher(rawText).find()
                || Pattern.compile("\\b\\d{10}\\b").matcher(rawText).find();
        boolean hasGithub = lowerText.contains("github.com") || lowerText.contains("github");
        boolean hasLinkedin = lowerText.contains("linkedin.com") || lowerText.contains("linkedin");

        int contactScore = 40;
        if (hasEmail) contactScore += 20;
        if (hasPhone) contactScore += 15;
        if (hasGithub) contactScore += 15;
        if (hasLinkedin) contactScore += 10;
        contactScore = Math.min(contactScore, 100);

        String contactStatus = (contactScore >= 80) ? "Strong" : (contactScore >= 60 ? "Average" : "Weak");
        StringBuilder contactNotes = new StringBuilder();
        if (hasEmail && hasPhone) contactNotes.append("Primary contact info is present. ");
        else contactNotes.append("Missing explicit email or phone contact details. ");
        if (!hasGithub) contactNotes.append("Consider adding your GitHub URL to showcase code commits. ");
        if (!hasLinkedin) contactNotes.append("Add your LinkedIn profile link for recruiter outreach. ");

        critiques.add(new ResumeAnalysisResponse.SectionCritique(
                "Contact Details & Portfolio Links",
                contactScore,
                contactStatus,
                contactNotes.toString().trim()
        ));

        // 2. Professional Summary
        boolean hasSummaryHeader = lowerText.contains("summary") || lowerText.contains("objective") || lowerText.contains("about me") || lowerText.contains("profile");
        int summaryScore = hasSummaryHeader ? 75 : 45;
        if (hasSummaryHeader && (lowerText.contains("aspiring") || lowerText.contains("developer") || lowerText.contains("engineer") || lowerText.contains("passionate"))) {
            summaryScore = 90;
        }
        String summaryStatus = (summaryScore >= 80) ? "Strong" : (summaryScore >= 60 ? "Average" : "Needs Improvement");
        String summaryFeedback = hasSummaryHeader
                ? "Summary section is present. Ensure it includes 2-3 sentences spotlighting your target role (" + roleTitle + "), primary tech stack, and what unique value you bring."
                : "No clear 'Professional Summary' or 'Career Objective' section detected. Add a crisp 2-3 sentence overview highlighting your career focus.";
        critiques.add(new ResumeAnalysisResponse.SectionCritique("Professional Summary", summaryScore, summaryStatus, summaryFeedback));

        // 3. Technical Projects Section
        boolean hasProjects = lowerText.contains("project") || lowerText.contains("projects");
        boolean hasMetrics = Pattern.compile("\\b(\\d+%|reduced by|increased by|built using|deployed on|users|api)\\b", Pattern.CASE_INSENSITIVE).matcher(rawText).find();
        int projectScore = 30;
        if (hasProjects) projectScore += 35;
        if (hasMetrics) projectScore += 25;
        if (lowerText.contains("github") || lowerText.contains("http") || lowerText.contains("live demo")) projectScore += 10;
        projectScore = Math.min(projectScore, 100);

        String projStatus = (projectScore >= 75) ? "Strong" : (projectScore >= 50 ? "Average" : "Weak");
        String projFeedback = hasProjects
                ? (hasMetrics
                    ? "Projects section includes technical context and measurable impact. Ensure each bullet point follows the Action Verb + Context + Result (XYZ) framework."
                    : "Projects are listed, but they lack measurable outcomes and numbers (e.g. '% speedup', 'API response time', 'user volume', or 'deployed URL'). Quantify results.")
                : "Missing a distinct Technical Projects section. Highlighting 2-3 end-to-end applications is critical for landing " + roleTitle + " interviews.";
        critiques.add(new ResumeAnalysisResponse.SectionCritique("Technical Projects & Proof of Work", projectScore, projStatus, projFeedback));

        // 4. Skills Formatting & Keyword Density
        boolean hasSkillsHeader = lowerText.contains("skills") || lowerText.contains("technologies") || lowerText.contains("technical skills");
        int skillsScore = hasSkillsHeader ? 75 : 40;
        if (lowerText.contains("languages:") || lowerText.contains("frameworks:") || lowerText.contains("tools:") || lowerText.contains("databases:")) {
            skillsScore = 95;
        }
        String skillsStatus = (skillsScore >= 80) ? "Strong" : (skillsScore >= 60 ? "Average" : "Weak");
        String skillsFeedback = hasSkillsHeader
                ? "Skills are listed. For best ATS readability, group them into clean categories: Programming Languages, Frameworks & Libraries, Databases, and Developer Tools."
                : "No designated 'Skills' section detected. Applicant Tracking Systems (ATS) rely heavily on categorized skill keywords.";
        critiques.add(new ResumeAnalysisResponse.SectionCritique("Skills Organization & ATS Compatibility", skillsScore, skillsStatus, skillsFeedback));

        // 5. Education
        boolean hasEducation = lowerText.contains("education") || lowerText.contains("b.tech") || lowerText.contains("bachelor") || lowerText.contains("degree") || lowerText.contains("university") || lowerText.contains("college");
        int eduScore = hasEducation ? 85 : 40;
        String eduStatus = hasEducation ? "Strong" : "Weak";
        String eduFeedback = hasEducation
                ? "Education details are present. Verify that your degree name, university, expected graduation year, and GPA/Percentage are clearly formatted."
                : "No explicit Education section found. Include degree title, university name, CGPA/percentage, and completion timeline.";
        critiques.add(new ResumeAnalysisResponse.SectionCritique("Education & Academic Credentials", eduScore, eduStatus, eduFeedback));

        return critiques;
    }

    private List<String> generateImprovementSuggestions(
            String rawText,
            String lowerText,
            List<MissingSkillDto> missingSkills,
            String roleTitle,
            double matchPercentage) {

        List<String> suggestions = new ArrayList<>();

        if (!missingSkills.isEmpty()) {
            String topMissing = missingSkills.stream()
                    .filter(s -> s.getPriority().equals("HIGH_PRIORITY"))
                    .limit(3)
                    .map(MissingSkillDto::getSkillName)
                    .collect(Collectors.joining(", "));
            if (topMissing.isEmpty()) {
                topMissing = missingSkills.stream().limit(3).map(MissingSkillDto::getSkillName).collect(Collectors.joining(", "));
            }
            suggestions.add("Add missing core technologies: Acquire and explicitly list '" + topMissing + "' on your resume to satisfy " + roleTitle + " minimum screening filters.");
        }

        if (!lowerText.contains("github.com") && !lowerText.contains("github")) {
            suggestions.add("Include Active GitHub Links: Technical recruiters verify candidate code directly. Add clickable links to your repositories with clear READMEs.");
        }

        if (!Pattern.compile("\\b(\\d+%|\\$\\d+|\\d+ms|\\d+ users|\\d+ requests)\\b").matcher(rawText).find()) {
            suggestions.add("Quantify Achievements (XYZ Formula): Rather than writing 'Developed a web app', write 'Engineered full-stack REST API in Spring Boot/React that reduced payload size by 35% and served 200+ simulated users'.");
        }

        if (!lowerText.contains("languages") || !lowerText.contains("frameworks")) {
            suggestions.add("Categorize Skills: Organize your Technical Skills section into 'Languages', 'Frameworks & Libraries', 'Databases', and 'Developer Tools / Platforms' to maximize ATS scan speed.");
        }

        if (matchPercentage < 60.0) {
            suggestions.add("Build a Role-Aligned Capstone Project: Create an end-to-end project specifically utilizing " + roleTitle + " industry technologies and document its architecture in your resume.");
        }

        suggestions.add("Action Verbs: Start every experience/project bullet point with strong action verbs (e.g. 'Architected', 'Implemented', 'Optimized', 'Containerized', 'Spearheaded') instead of passive statements like 'Worked on'.");

        return suggestions;
    }

    private List<ProjectDto> findProjectsForGaps(Set<Long> missingSkillIds, Long roleId) {
        List<ProjectRecommendation> allProjects = projectRepository.findAll();
        List<ProjectDto> results = new ArrayList<>();

        for (ProjectRecommendation p : allProjects) {
            ProjectDto dto = new ProjectDto();
            dto.setId(p.getId());
            dto.setTitle(p.getTitle());
            dto.setDescription(p.getDescription());
            dto.setDifficulty(p.getDifficulty());
            dto.setTechStack(p.getTechStack());
            dto.setEstimatedDuration(p.getEstimatedDuration());
            dto.setLearningOutcomes(p.getLearningOutcomes());
            if (p.getTargetRole() != null) {
                dto.setTargetRoleTitle(p.getTargetRole().getTitle());
            }
            dto.setAddressedSkills(p.getTargetSkills().stream().map(Skill::getName).collect(Collectors.toList()));

            // Count matching missing skills
            int matchCount = 0;
            for (Skill s : p.getTargetSkills()) {
                if (missingSkillIds.contains(s.getId())) {
                    matchCount++;
                }
            }
            dto.setMatchingMissingSkillsCount(matchCount);

            boolean isTargetRole = (p.getTargetRole() != null && p.getTargetRole().getId().equals(roleId));
            if (isTargetRole || matchCount > 0) {
                results.add(dto);
            }
        }

        results.sort((a, b) -> Integer.compare(b.getMatchingMissingSkillsCount(), a.getMatchingMissingSkillsCount()));

        if (results.isEmpty()) {
            return projectRepository.findAll().stream().limit(4).map(p -> {
                ProjectDto dto = new ProjectDto();
                dto.setId(p.getId());
                dto.setTitle(p.getTitle());
                dto.setDescription(p.getDescription());
                dto.setDifficulty(p.getDifficulty());
                dto.setTechStack(p.getTechStack());
                dto.setEstimatedDuration(p.getEstimatedDuration());
                dto.setLearningOutcomes(p.getLearningOutcomes());
                if (p.getTargetRole() != null) dto.setTargetRoleTitle(p.getTargetRole().getTitle());
                dto.setAddressedSkills(p.getTargetSkills().stream().map(Skill::getName).collect(Collectors.toList()));
                return dto;
            }).collect(Collectors.toList());
        }

        return results.stream().limit(6).collect(Collectors.toList());
    }
}
