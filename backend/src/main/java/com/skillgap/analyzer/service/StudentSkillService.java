package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.AddStudentSkillRequest;
import com.skillgap.analyzer.dto.StudentSkillDto;
import com.skillgap.analyzer.entity.ProficiencyLevel;
import com.skillgap.analyzer.entity.Skill;
import com.skillgap.analyzer.entity.SkillCategory;
import com.skillgap.analyzer.entity.StudentSkill;
import com.skillgap.analyzer.entity.User;
import com.skillgap.analyzer.exception.BadRequestException;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.SkillRepository;
import com.skillgap.analyzer.repository.StudentSkillRepository;
import com.skillgap.analyzer.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentSkillService {

    private final StudentSkillRepository studentSkillRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;

    public StudentSkillService(StudentSkillRepository studentSkillRepository,
                               SkillRepository skillRepository,
                               UserRepository userRepository,
                               SkillService skillService) {
        this.studentSkillRepository = studentSkillRepository;
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
        this.skillService = skillService;
    }

    public List<StudentSkillDto> getStudentSkills(String email) {
        User user = getUserByEmail(email);
        return studentSkillRepository.findAllWithSkillByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentSkillDto addSkill(String email, AddStudentSkillRequest request) {
        User user = getUserByEmail(email);

        Skill skill;
        if (request.getSkillId() != null) {
            skill = skillRepository.findById(request.getSkillId())
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + request.getSkillId()));
        } else if (request.getCustomSkillName() != null && !request.getCustomSkillName().isBlank()) {
            SkillCategory cat = SkillCategory.SOFTWARE_ENGINEERING;
            if (request.getCategory() != null) {
                try {
                    cat = SkillCategory.valueOf(request.getCategory().toUpperCase());
                } catch (IllegalArgumentException ignored) {}
            }
            skill = skillService.findOrCreateSkillByName(request.getCustomSkillName(), cat);
        } else {
            throw new BadRequestException("Either skillId or customSkillName must be provided!");
        }

        // Check if student already has this skill
        if (studentSkillRepository.existsByUserIdAndSkillId(user.getId(), skill.getId())) {
            throw new BadRequestException("You already have '" + skill.getName() + "' in your skill profile. You can update its proficiency.");
        }

        StudentSkill studentSkill = new StudentSkill(
                user,
                skill,
                request.getProficiency() != null ? request.getProficiency() : ProficiencyLevel.INTERMEDIATE,
                request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 1
        );

        StudentSkill saved = studentSkillRepository.save(studentSkill);
        return mapToDto(saved);
    }

    @Transactional
    public List<StudentSkillDto> addSkillsBulk(String email, List<AddStudentSkillRequest> requests) {
        User user = getUserByEmail(email);
        List<StudentSkillDto> results = new ArrayList<>();

        for (AddStudentSkillRequest req : requests) {
            Skill skill = null;
            if (req.getSkillId() != null) {
                skill = skillRepository.findById(req.getSkillId()).orElse(null);
            } else if (req.getCustomSkillName() != null && !req.getCustomSkillName().isBlank()) {
                SkillCategory cat = SkillCategory.SOFTWARE_ENGINEERING;
                if (req.getCategory() != null) {
                    try {
                        cat = SkillCategory.valueOf(req.getCategory().toUpperCase());
                    } catch (IllegalArgumentException ignored) {}
                }
                skill = skillService.findOrCreateSkillByName(req.getCustomSkillName(), cat);
            }

            if (skill == null) continue;

            Optional<StudentSkill> existing = studentSkillRepository.findByUserIdAndSkillId(user.getId(), skill.getId());
            if (existing.isPresent()) {
                StudentSkill ss = existing.get();
                if (req.getProficiency() != null) {
                    ss.setProficiency(req.getProficiency());
                }
                if (req.getYearsOfExperience() != null) {
                    ss.setYearsOfExperience(req.getYearsOfExperience());
                }
                results.add(mapToDto(studentSkillRepository.save(ss)));
            } else {
                StudentSkill ss = new StudentSkill(
                        user,
                        skill,
                        req.getProficiency() != null ? req.getProficiency() : ProficiencyLevel.INTERMEDIATE,
                        req.getYearsOfExperience() != null ? req.getYearsOfExperience() : 1
                );
                results.add(mapToDto(studentSkillRepository.save(ss)));
            }
        }
        return results;
    }

    @Transactional
    public StudentSkillDto updateSkill(String email, Long studentSkillId, ProficiencyLevel proficiency, Integer years) {
        User user = getUserByEmail(email);
        StudentSkill studentSkill = studentSkillRepository.findById(studentSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Student skill not found with ID: " + studentSkillId));

        if (!studentSkill.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to modify this skill record");
        }

        if (proficiency != null) {
            studentSkill.setProficiency(proficiency);
        }
        if (years != null) {
            studentSkill.setYearsOfExperience(years);
        }

        StudentSkill saved = studentSkillRepository.save(studentSkill);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteSkill(String email, Long studentSkillId) {
        User user = getUserByEmail(email);
        StudentSkill studentSkill = studentSkillRepository.findById(studentSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("Student skill not found with ID: " + studentSkillId));

        if (!studentSkill.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to delete this skill record");
        }

        studentSkillRepository.delete(studentSkill);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private StudentSkillDto mapToDto(StudentSkill entity) {
        return new StudentSkillDto(
                entity.getId(),
                entity.getSkill().getId(),
                entity.getSkill().getName(),
                entity.getSkill().getCategory(),
                entity.getProficiency(),
                entity.getYearsOfExperience()
        );
    }
}
