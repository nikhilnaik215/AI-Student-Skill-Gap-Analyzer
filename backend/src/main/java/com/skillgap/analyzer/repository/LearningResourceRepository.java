package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    List<LearningResource> findBySkillNameIgnoreCase(String skillName);
    List<LearningResource> findBySkillId(Long skillId);
    List<LearningResource> findBySkillNameContainingIgnoreCase(String query);
}
