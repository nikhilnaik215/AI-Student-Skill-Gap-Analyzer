package com.skillgap.analyzer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgap.analyzer.dto.ResumeDto;
import com.skillgap.analyzer.entity.StudentProfile;
import com.skillgap.analyzer.entity.StudentResume;
import com.skillgap.analyzer.entity.StudentSkill;
import com.skillgap.analyzer.entity.User;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.StudentProfileRepository;
import com.skillgap.analyzer.repository.StudentResumeRepository;
import com.skillgap.analyzer.repository.StudentSkillRepository;
import com.skillgap.analyzer.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ResumeService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final StudentResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;

    public ResumeService(UserRepository userRepository,
                         StudentProfileRepository profileRepository,
                         StudentSkillRepository studentSkillRepository,
                         StudentResumeRepository resumeRepository,
                         ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.resumeRepository = resumeRepository;
        this.objectMapper = objectMapper;
    }

    public ResumeDto getResume(String email) {
        User user = getUserByEmail(email);

        StudentResume resume = resumeRepository.findByUser(user)
                .orElseGet(() -> createInitialResume(user));

        return mapToDto(resume);
    }

    @Transactional
    public ResumeDto saveResume(String email, ResumeDto dto) {
        User user = getUserByEmail(email);

        StudentResume resume = resumeRepository.findByUser(user)
                .orElseGet(() -> new StudentResume(user));

        resume.setFullName(dto.getFullName());
        resume.setEmail(dto.getEmail());
        resume.setPhone(dto.getPhone());
        resume.setLocation(dto.getLocation());
        resume.setJobTitle(dto.getJobTitle());
        resume.setSummary(dto.getSummary());
        resume.setGithubUrl(dto.getGithubUrl());
        resume.setLinkedinUrl(dto.getLinkedinUrl());
        resume.setPortfolioUrl(dto.getPortfolioUrl());
        resume.setEducationJson(dto.getEducationJson());
        resume.setExperienceJson(dto.getExperienceJson());
        resume.setProjectsJson(dto.getProjectsJson());
        resume.setSkillsJson(dto.getSkillsJson());
        resume.setCertificationsJson(dto.getCertificationsJson());
        resume.setSectionOrderJson(dto.getSectionOrderJson());
        if (dto.getTemplate() != null && !dto.getTemplate().isBlank()) {
            resume.setTemplate(dto.getTemplate());
        }

        StudentResume saved = resumeRepository.save(resume);
        return mapToDto(saved);
    }

    @Transactional
    public ResumeDto populateFromProfile(String email) {
        User user = getUserByEmail(email);
        StudentProfile profile = profileRepository.findByUser(user).orElse(null);
        List<StudentSkill> skills = studentSkillRepository.findAllWithSkillByUserId(user.getId());

        StudentResume resume = resumeRepository.findByUser(user)
                .orElseGet(() -> new StudentResume(user));

        resume.setFullName(user.getFullName());
        resume.setEmail(user.getEmail());

        if (profile != null) {
            resume.setPhone(profile.getPhone());
            if (profile.getTargetRole() != null) {
                resume.setJobTitle(profile.getTargetRole().getTitle());
            }
            if (profile.getBio() != null && !profile.getBio().isBlank()) {
                resume.setSummary(profile.getBio());
            }
            resume.setGithubUrl(profile.getGithubUrl());
            resume.setLinkedinUrl(profile.getLinkedinUrl());

            // Build Education JSON
            if (profile.getCollege() != null || profile.getDegree() != null) {
                try {
                    List<Map<String, Object>> eduList = new ArrayList<>();
                    Map<String, Object> edu = new HashMap<>();
                    edu.put("id", UUID.randomUUID().toString());
                    edu.put("institution", profile.getCollege() != null ? profile.getCollege() : "University / College");
                    edu.put("degree", profile.getDegree() != null ? profile.getDegree() : "B.Tech in Computer Science");
                    edu.put("year", profile.getGraduationYear() != null ? String.valueOf(profile.getGraduationYear()) : "2025");
                    edu.put("gpa", "8.5 / 10.0");
                    edu.put("details", "Core Coursework: Data Structures, Database Management, Operating Systems, Computer Networks.");
                    eduList.add(edu);
                    resume.setEducationJson(objectMapper.writeValueAsString(eduList));
                } catch (Exception ignored) {}
            }
        }

        // Build Skills JSON from student declared skills
        if (!skills.isEmpty()) {
            try {
                List<Map<String, Object>> skillList = new ArrayList<>();
                for (StudentSkill ss : skills) {
                    Map<String, Object> s = new HashMap<>();
                    s.put("id", UUID.randomUUID().toString());
                    s.put("name", ss.getSkill().getName());
                    s.put("category", ss.getSkill().getCategory().name().replace("_", " "));
                    s.put("proficiency", ss.getProficiency().name());
                    skillList.add(s);
                }
                resume.setSkillsJson(objectMapper.writeValueAsString(skillList));
            } catch (Exception ignored) {}
        }

        // Add sample starter project if none exists
        if (resume.getProjectsJson() == null || resume.getProjectsJson().isBlank() || resume.getProjectsJson().equals("[]")) {
            try {
                List<Map<String, Object>> projList = new ArrayList<>();
                Map<String, Object> p = new HashMap<>();
                p.put("id", UUID.randomUUID().toString());
                p.put("title", "AI-Powered Student Skill Gap Analyzer");
                p.put("techStack", "Java 21, Spring Boot, MySQL, React.js, JWT, Bootstrap");
                p.put("duration", "4 Months");
                p.put("description", "Designed a full-stack platform providing algorithmic career readiness benchmarking, AI personalized roadmaps, and targeted project recommendations.");
                p.put("liveUrl", "http://localhost:3000");
                p.put("githubUrl", "https://github.com/example/skill-gap-analyzer");
                projList.add(p);
                resume.setProjectsJson(objectMapper.writeValueAsString(projList));
            } catch (Exception ignored) {}
        }

        StudentResume saved = resumeRepository.save(resume);
        return mapToDto(saved);
    }

    private StudentResume createInitialResume(User user) {
        StudentResume resume = new StudentResume(user);
        resume.setFullName(user.getFullName());
        resume.setEmail(user.getEmail());
        resume.setJobTitle("Aspiring Software Engineer");
        resume.setSummary("Motivated software developer passionate about building reliable full-stack applications and solving complex engineering challenges.");
        resume.setSectionOrderJson("[\"summary\",\"skills\",\"experience\",\"projects\",\"education\",\"certifications\"]");
        resume.setTemplate("modern");
        return resumeRepository.save(resume);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private ResumeDto mapToDto(StudentResume resume) {
        ResumeDto dto = new ResumeDto();
        dto.setId(resume.getId());
        dto.setUserId(resume.getUser().getId());
        dto.setFullName(resume.getFullName());
        dto.setEmail(resume.getEmail());
        dto.setPhone(resume.getPhone());
        dto.setLocation(resume.getLocation());
        dto.setJobTitle(resume.getJobTitle());
        dto.setSummary(resume.getSummary());
        dto.setGithubUrl(resume.getGithubUrl());
        dto.setLinkedinUrl(resume.getLinkedinUrl());
        dto.setPortfolioUrl(resume.getPortfolioUrl());
        dto.setEducationJson(resume.getEducationJson());
        dto.setExperienceJson(resume.getExperienceJson());
        dto.setProjectsJson(resume.getProjectsJson());
        dto.setSkillsJson(resume.getSkillsJson());
        dto.setCertificationsJson(resume.getCertificationsJson());
        dto.setSectionOrderJson(resume.getSectionOrderJson());
        dto.setTemplate(resume.getTemplate());
        if (resume.getUpdatedAt() != null) {
            dto.setUpdatedAt(resume.getUpdatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
        }
        return dto;
    }
}
