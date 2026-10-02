package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.JobRoleDto;
import com.skillgap.analyzer.dto.JobRoleSkillDto;
import com.skillgap.analyzer.entity.JobRole;
import com.skillgap.analyzer.entity.JobRoleSkill;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.JobRoleRepository;
import com.skillgap.analyzer.repository.JobRoleSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobRoleService {

    private final JobRoleRepository jobRoleRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;

    public JobRoleService(JobRoleRepository jobRoleRepository, JobRoleSkillRepository jobRoleSkillRepository) {
        this.jobRoleRepository = jobRoleRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
    }

    public List<JobRoleDto> getAllRoles() {
        return jobRoleRepository.findAll()
                .stream()
                .map(this::mapToDtoSummary)
                .collect(Collectors.toList());
    }

    public JobRoleDto getRoleById(Long id) {
        JobRole role = jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with ID: " + id));

        List<JobRoleSkill> roleSkills = jobRoleSkillRepository.findAllWithSkillByJobRoleId(id);
        List<JobRoleSkillDto> skillDtos = roleSkills.stream()
                .map(this::mapRoleSkillToDto)
                .collect(Collectors.toList());

        JobRoleDto dto = mapToDtoSummary(role);
        dto.setRequiredSkills(skillDtos);
        return dto;
    }

    public JobRole getRoleEntityById(Long id) {
        return jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with ID: " + id));
    }

    private JobRoleDto mapToDtoSummary(JobRole role) {
        JobRoleDto dto = new JobRoleDto();
        dto.setId(role.getId());
        dto.setTitle(role.getTitle());
        dto.setDescription(role.getDescription());
        dto.setIndustryDemand(role.getIndustryDemand());
        dto.setAvgSalary(role.getAvgSalary());
        dto.setIcon(role.getIcon());
        dto.setRequiredSkillsCount(jobRoleSkillRepository.findByJobRoleId(role.getId()).size());
        return dto;
    }

    private JobRoleSkillDto mapRoleSkillToDto(JobRoleSkill jrs) {
        return new JobRoleSkillDto(
                jrs.getId(),
                jrs.getSkill().getId(),
                jrs.getSkill().getName(),
                jrs.getSkill().getCategory(),
                jrs.getImportance(),
                jrs.getMinProficiency(),
                jrs.getWeight()
        );
    }
}
