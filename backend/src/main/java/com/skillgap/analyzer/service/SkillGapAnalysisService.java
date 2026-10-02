package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.MatchedSkillDto;
import com.skillgap.analyzer.dto.MissingSkillDto;
import com.skillgap.analyzer.dto.SkillGapAnalysisResponse;
import com.skillgap.analyzer.entity.*;
import com.skillgap.analyzer.exception.BadRequestException;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.JobRoleRepository;
import com.skillgap.analyzer.repository.JobRoleSkillRepository;
import com.skillgap.analyzer.repository.StudentProfileRepository;
import com.skillgap.analyzer.repository.StudentSkillRepository;
import com.skillgap.analyzer.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapAnalysisService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final JobRoleRepository jobRoleRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;

    public SkillGapAnalysisService(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            StudentSkillRepository studentSkillRepository,
            JobRoleRepository jobRoleRepository,
            JobRoleSkillRepository jobRoleSkillRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
    }

    public SkillGapAnalysisResponse analyzeForTargetRole(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Student profile not set up yet. Please select a target career role."));

        if (profile.getTargetRole() == null) {
            throw new BadRequestException("No target career role selected. Please choose a target role (e.g. Java Developer, Data Analyst) in your profile first.");
        }

        return performAnalysis(user, profile.getTargetRole());
    }

    public SkillGapAnalysisResponse analyzeForRole(String email, Long roleId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        JobRole role = jobRoleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with ID: " + roleId));

        return performAnalysis(user, role);
    }

    private SkillGapAnalysisResponse performAnalysis(User student, JobRole role) {
        List<StudentSkill> studentSkills = studentSkillRepository.findAllWithSkillByUserId(student.getId());
        List<JobRoleSkill> roleSkills = jobRoleSkillRepository.findAllWithSkillByJobRoleId(role.getId());

        // Map student skills by skill id
        Map<Long, StudentSkill> studentSkillMap = studentSkills.stream()
                .collect(Collectors.toMap(ss -> ss.getSkill().getId(), ss -> ss));

        List<MatchedSkillDto> matchedList = new ArrayList<>();
        List<MissingSkillDto> missingList = new ArrayList<>();
        Map<String, Integer> categorySkillCounts = new HashMap<>();

        double totalMaxPoints = 0.0;
        double earnedPoints = 0.0;

        for (JobRoleSkill rSkill : roleSkills) {
            Skill skill = rSkill.getSkill();
            double importanceMultiplier = (rSkill.getImportance() == Importance.REQUIRED) ? 1.25 : 1.0;
            double maxSkillPoints = rSkill.getWeight() * importanceMultiplier;
            totalMaxPoints += maxSkillPoints;

            // Track category
            categorySkillCounts.put(skill.getCategory().name(), categorySkillCounts.getOrDefault(skill.getCategory().name(), 0) + 1);

            if (studentSkillMap.containsKey(skill.getId())) {
                // Student has this skill
                StudentSkill sSkill = studentSkillMap.get(skill.getId());
                int studentWeight = sSkill.getProficiency().getLevelWeight();
                int requiredWeight = rSkill.getMinProficiency().getLevelWeight();

                boolean proficiencyMet = studentWeight >= requiredWeight;
                double earned;
                String gapNote;

                if (proficiencyMet) {
                    earned = maxSkillPoints;
                    gapNote = "Proficiency requirement satisfied (" + sSkill.getProficiency() + ")";
                } else {
                    int diff = requiredWeight - studentWeight;
                    double partialRatio = (diff == 1) ? 0.60 : 0.30;
                    earned = maxSkillPoints * partialRatio;
                    gapNote = "Proficiency gap: You are at " + sSkill.getProficiency() + ", target requires " + rSkill.getMinProficiency();
                }

                earnedPoints += earned;

                matchedList.add(new MatchedSkillDto(
                        skill.getId(),
                        skill.getName(),
                        skill.getCategory(),
                        sSkill.getProficiency(),
                        rSkill.getMinProficiency(),
                        rSkill.getImportance(),
                        proficiencyMet,
                        gapNote
                ));
            } else {
                // Student lacks this skill
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

        // Sort missing skills: high priority first, then highest weight
        missingList.sort((a, b) -> {
            if (a.getPriority().equals(b.getPriority())) {
                return b.getWeight().compareTo(a.getWeight());
            }
            return a.getPriority().equals("HIGH_PRIORITY") ? -1 : 1;
        });

        double matchPercentage = 0.0;
        if (totalMaxPoints > 0) {
            matchPercentage = Math.round((earnedPoints / totalMaxPoints) * 1000.0) / 10.0;
            if (matchPercentage > 100.0) matchPercentage = 100.0;
        }

        String readinessStatus;
        String badgeColor;
        String aiSummary;

        if (matchPercentage >= 80.0) {
            readinessStatus = "JOB_READY";
            badgeColor = "success";
            aiSummary = "Outstanding profile! You already meet the core competencies for " + role.getTitle() + " (" + matchPercentage + "% match). Focus on end-to-end full-stack projects, mock interviews, and advanced architecture patterns.";
        } else if (matchPercentage >= 50.0) {
            readinessStatus = "PROGRESSING_WELL";
            badgeColor = "primary";
            aiSummary = "Promising progress! You demonstrate foundational capability for " + role.getTitle() + " (" + matchPercentage + "% match). Prioritize acquiring the " + missingList.size() + " missing skills (highlighted below) through our AI Roadmap to become industry-ready.";
        } else {
            readinessStatus = "NEEDS_FOUNDATIONAL_SKILLS";
            badgeColor = "warning";
            aiSummary = "Clear skill gap identified for " + role.getTitle() + " (" + matchPercentage + "% match). You need to acquire core prerequisite technologies. Follow the step-by-step AI Learning Roadmap and build the recommended projects to bridge this gap systematically.";
        }

        SkillGapAnalysisResponse response = new SkillGapAnalysisResponse();
        response.setStudentId(student.getId());
        response.setStudentName(student.getFullName());
        response.setJobRoleId(role.getId());
        response.setJobRoleTitle(role.getTitle());
        response.setJobRoleDescription(role.getDescription());
        response.setOverallMatchPercentage(matchPercentage);
        response.setReadinessStatus(readinessStatus);
        response.setReadinessBadgeColor(badgeColor);
        response.setTotalRoleSkills(roleSkills.size());
        response.setMatchedSkillsCount(matchedList.size());
        response.setMissingSkillsCount(missingList.size());
        response.setMatchedSkills(matchedList);
        response.setMissingSkills(missingList);
        response.setCategorySkillCounts(categorySkillCounts);
        response.setAiSummaryRecommendation(aiSummary);

        return response;
    }
}
