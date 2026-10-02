package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.AdminStatsDto;
import com.skillgap.analyzer.dto.JobRoleDto;
import com.skillgap.analyzer.dto.JobRoleSkillDto;
import com.skillgap.analyzer.dto.StudentSummaryDto;
import com.skillgap.analyzer.entity.*;
import com.skillgap.analyzer.exception.BadRequestException;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final JobRoleRepository jobRoleRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;
    private final LearningRoadmapRepository roadmapRepository;

    public AdminService(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            SkillRepository skillRepository,
            StudentSkillRepository studentSkillRepository,
            JobRoleRepository jobRoleRepository,
            JobRoleSkillRepository jobRoleSkillRepository,
            LearningRoadmapRepository roadmapRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
        this.roadmapRepository = roadmapRepository;
    }

    public AdminStatsDto getStats() {
        AdminStatsDto stats = new AdminStatsDto();
        stats.setTotalStudents(userRepository.countByRole(Role.ROLE_STUDENT));
        stats.setTotalRoles(jobRoleRepository.count());
        stats.setTotalSkills(skillRepository.count());
        stats.setTotalRoadmaps(roadmapRepository.count());

        Map<String, Long> studentsPerRole = new HashMap<>();
        List<JobRole> roles = jobRoleRepository.findAll();
        for (JobRole r : roles) {
            long count = profileRepository.countByTargetRoleId(r.getId());
            studentsPerRole.put(r.getTitle(), count);
        }
        stats.setStudentsPerRole(studentsPerRole);

        return stats;
    }

    public List<StudentSummaryDto> getAllStudents() {
        List<User> students = userRepository.findByRole(Role.ROLE_STUDENT);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

        return students.stream().map(student -> {
            StudentSummaryDto dto = new StudentSummaryDto();
            dto.setUserId(student.getId());
            dto.setFullName(student.getFullName());
            dto.setEmail(student.getEmail());
            dto.setRegisteredAt(student.getCreatedAt() != null ? student.getCreatedAt().format(formatter) : "N/A");

            StudentProfile profile = profileRepository.findByUser(student).orElse(null);
            if (profile != null) {
                dto.setCollege(profile.getCollege());
                dto.setDegree(profile.getDegree());
                dto.setGraduationYear(profile.getGraduationYear());
                if (profile.getTargetRole() != null) {
                    dto.setTargetRole(profile.getTargetRole().getTitle());
                } else {
                    dto.setTargetRole("Not Selected");
                }
            } else {
                dto.setTargetRole("Not Selected");
            }

            dto.setSkillsCount((int) studentSkillRepository.countByUserId(student.getId()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public JobRole createJobRole(JobRoleDto dto) {
        if (jobRoleRepository.existsByTitleIgnoreCase(dto.getTitle().trim())) {
            throw new BadRequestException("Role '" + dto.getTitle() + "' already exists!");
        }

        JobRole role = new JobRole(
                dto.getTitle().trim(),
                dto.getDescription(),
                dto.getIndustryDemand() != null ? dto.getIndustryDemand() : IndustryDemand.HIGH,
                dto.getAvgSalary() != null ? dto.getAvgSalary() : "₹6,00,000 - ₹12,00,000 / year",
                dto.getIcon() != null ? dto.getIcon() : "briefcase"
        );
        return jobRoleRepository.save(role);
    }

    @Transactional
    public JobRoleSkill addSkillToJobRole(Long roleId, JobRoleSkillDto dto) {
        JobRole role = jobRoleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with ID: " + roleId));

        Skill skill = skillRepository.findById(dto.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + dto.getSkillId()));

        Optional<JobRoleSkill> existing = jobRoleSkillRepository.findByJobRoleIdAndSkillId(roleId, dto.getSkillId());
        if (existing.isPresent()) {
            JobRoleSkill jrs = existing.get();
            jrs.setImportance(dto.getImportance() != null ? dto.getImportance() : Importance.REQUIRED);
            jrs.setMinProficiency(dto.getMinProficiency() != null ? dto.getMinProficiency() : ProficiencyLevel.INTERMEDIATE);
            jrs.setWeight(dto.getWeight() != null ? dto.getWeight() : 3);
            return jobRoleSkillRepository.save(jrs);
        }

        JobRoleSkill jrs = new JobRoleSkill(
                role,
                skill,
                dto.getImportance() != null ? dto.getImportance() : Importance.REQUIRED,
                dto.getMinProficiency() != null ? dto.getMinProficiency() : ProficiencyLevel.INTERMEDIATE,
                dto.getWeight() != null ? dto.getWeight() : 3
        );
        return jobRoleSkillRepository.save(jrs);
    }

    @Transactional
    public void deleteJobRole(Long roleId) {
        jobRoleSkillRepository.deleteByJobRoleId(roleId);
        jobRoleRepository.deleteById(roleId);
    }
}
