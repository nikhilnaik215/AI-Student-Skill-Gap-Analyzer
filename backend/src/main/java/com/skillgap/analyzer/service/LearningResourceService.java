package com.skillgap.analyzer.service;

import com.skillgap.analyzer.dto.LearningResourceDto;
import com.skillgap.analyzer.entity.DifficultyLevel;
import com.skillgap.analyzer.entity.LearningResource;
import com.skillgap.analyzer.entity.Skill;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.LearningResourceRepository;
import com.skillgap.analyzer.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningResourceService {

    private final LearningResourceRepository resourceRepository;
    private final SkillRepository skillRepository;

    public LearningResourceService(LearningResourceRepository resourceRepository, SkillRepository skillRepository) {
        this.resourceRepository = resourceRepository;
        this.skillRepository = skillRepository;
    }

    public List<LearningResourceDto> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<LearningResourceDto> getResourcesBySkillName(String skillName) {
        if (skillName == null || skillName.isBlank()) {
            return getAllResources();
        }
        return resourceRepository.findBySkillNameContainingIgnoreCase(skillName.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<LearningResourceDto> getResourcesBySkillId(Long skillId) {
        return resourceRepository.findBySkillId(skillId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LearningResourceDto addResource(LearningResourceDto dto) {
        Skill skill = null;
        if (dto.getSkillId() != null) {
            skill = skillRepository.findById(dto.getSkillId()).orElse(null);
        } else if (dto.getSkillName() != null) {
            skill = skillRepository.findByNameIgnoreCase(dto.getSkillName().trim()).orElse(null);
        }

        LearningResource resource = new LearningResource(
                skill,
                dto.getSkillName() != null ? dto.getSkillName().trim() : (skill != null ? skill.getName() : "General"),
                dto.getTitle(),
                dto.getTopic(),
                dto.getChannelName(),
                dto.getYoutubeUrl(),
                dto.getDuration() != null ? dto.getDuration() : "1 hour",
                dto.getDifficulty() != null ? dto.getDifficulty() : DifficultyLevel.BEGINNER
        );
        resource.setThumbnailUrl(dto.getThumbnailUrl());

        LearningResource saved = resourceRepository.save(resource);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteResource(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with ID: " + id);
        }
        resourceRepository.deleteById(id);
    }

    private LearningResourceDto mapToDto(LearningResource r) {
        LearningResourceDto dto = new LearningResourceDto();
        dto.setId(r.getId());
        if (r.getSkill() != null) {
            dto.setSkillId(r.getSkill().getId());
        }
        dto.setSkillName(r.getSkillName());
        dto.setTitle(r.getTitle());
        dto.setTopic(r.getTopic());
        dto.setChannelName(r.getChannelName());
        dto.setYoutubeUrl(r.getYoutubeUrl());
        dto.setThumbnailUrl(r.getThumbnailUrl());
        dto.setDuration(r.getDuration());
        dto.setDifficulty(r.getDifficulty());
        return dto;
    }
}
