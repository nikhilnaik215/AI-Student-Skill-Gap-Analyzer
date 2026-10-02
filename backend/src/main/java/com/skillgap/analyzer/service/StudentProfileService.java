package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.StudentProfileDto;
import com.skillgap.analyzer.entity.JobRole;
import com.skillgap.analyzer.entity.StudentProfile;
import com.skillgap.analyzer.entity.User;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.JobRoleRepository;
import com.skillgap.analyzer.repository.StudentProfileRepository;
import com.skillgap.analyzer.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final JobRoleRepository jobRoleRepository;

    public StudentProfileService(UserRepository userRepository,
                                 StudentProfileRepository profileRepository,
                                 JobRoleRepository jobRoleRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.jobRoleRepository = jobRoleRepository;
    }

    public StudentProfileDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentProfile newProfile = new StudentProfile(user);
                    return profileRepository.save(newProfile);
                });

        return mapToDto(profile);
    }

    @Transactional
    public StudentProfileDto updateProfile(String email, StudentProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> new StudentProfile(user));

        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            user.setFullName(dto.getFullName().trim());
            userRepository.save(user);
        }

        profile.setPhone(dto.getPhone());
        profile.setCollege(dto.getCollege());
        profile.setDegree(dto.getDegree());
        profile.setGraduationYear(dto.getGraduationYear());
        profile.setBio(dto.getBio());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());

        if (dto.getTargetRoleId() != null) {
            JobRole targetRole = jobRoleRepository.findById(dto.getTargetRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + dto.getTargetRoleId()));
            profile.setTargetRole(targetRole);
        }

        StudentProfile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    @Transactional
    public StudentProfileDto setTargetRole(String email, Long roleId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> new StudentProfile(user));

        JobRole targetRole = jobRoleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Career role not found with id: " + roleId));

        profile.setTargetRole(targetRole);
        StudentProfile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    @Transactional
    public StudentProfileDto completeOnboarding(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseGet(() -> new StudentProfile(user));

        profile.setOnboardingCompleted(true);
        StudentProfile saved = profileRepository.save(profile);
        return mapToDto(saved);
    }

    private StudentProfileDto mapToDto(StudentProfile profile) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setFullName(profile.getUser().getFullName());
        dto.setEmail(profile.getUser().getEmail());
        dto.setPhone(profile.getPhone());
        dto.setCollege(profile.getCollege());
        dto.setDegree(profile.getDegree());
        dto.setGraduationYear(profile.getGraduationYear());
        dto.setBio(profile.getBio());
        dto.setLinkedinUrl(profile.getLinkedinUrl());
        dto.setGithubUrl(profile.getGithubUrl());
        dto.setOnboardingCompleted(profile.isOnboardingCompleted());

        if (profile.getTargetRole() != null) {
            dto.setTargetRoleId(profile.getTargetRole().getId());
            dto.setTargetRoleTitle(profile.getTargetRole().getTitle());
            dto.setTargetRoleDescription(profile.getTargetRole().getDescription());
        }

        return dto;
    }
}
