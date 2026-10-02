package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.SkillDto;
import com.skillgap.analyzer.entity.Skill;
import com.skillgap.analyzer.entity.SkillCategory;
import com.skillgap.analyzer.exception.BadRequestException;
import com.skillgap.analyzer.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SkillDto> getSkillsByCategory(SkillCategory category) {
        return skillRepository.findByCategory(category)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SkillDto> searchSkills(String query) {
        if (query == null || query.isBlank()) {
            return getAllSkills();
        }
        return skillRepository.findByNameContainingIgnoreCase(query.trim())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto createSkill(SkillDto dto) {
        if (skillRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new BadRequestException("Skill '" + dto.getName() + "' already exists in catalog!");
        }

        Skill skill = new Skill(
                dto.getName().trim(),
                dto.getCategory() != null ? dto.getCategory() : SkillCategory.SOFTWARE_ENGINEERING,
                dto.getDescription()
        );
        Skill saved = skillRepository.save(skill);
        return mapToDto(saved);
    }

    public Skill findOrCreateSkillByName(String name, SkillCategory defaultCategory) {
        String cleanName = name.trim();
        return skillRepository.findByNameIgnoreCase(cleanName)
                .orElseGet(() -> skillRepository.save(new Skill(
                        cleanName,
                        defaultCategory != null ? defaultCategory : SkillCategory.SOFTWARE_ENGINEERING,
                        "User added skill: " + cleanName
                )));
    }

    private SkillDto mapToDto(Skill skill) {
        return new SkillDto(skill.getId(), skill.getName(), skill.getCategory(), skill.getDescription());
    }
}
