package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.DifficultyLevel;
import com.skillgap.analyzer.entity.ProjectRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ProjectRecommendationRepository extends JpaRepository<ProjectRecommendation, Long> {
    List<ProjectRecommendation> findByTargetRoleId(Long jobRoleId);
    List<ProjectRecommendation> findByDifficulty(DifficultyLevel difficulty);

    @Query("SELECT DISTINCT p FROM ProjectRecommendation p JOIN p.targetSkills s WHERE s.id IN :skillIds")
    List<ProjectRecommendation> findProjectsMatchingSkillIds(@Param("skillIds") Set<Long> skillIds);
}
