package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.Skill;
import com.skillgap.analyzer.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByNameIgnoreCase(String name);
    Boolean existsByNameIgnoreCase(String name);
    List<Skill> findByCategory(SkillCategory category);
    List<Skill> findByNameContainingIgnoreCase(String name);
}
