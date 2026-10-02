package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.LearningRoadmap;
import com.skillgap.analyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {
    List<LearningRoadmap> findByUserOrderByCreatedAtDesc(User user);
    List<LearningRoadmap> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<LearningRoadmap> findTopByUserIdAndJobRoleIdOrderByCreatedAtDesc(Long userId, Long jobRoleId);
}
