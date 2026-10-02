package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.Importance;
import com.skillgap.analyzer.entity.JobRole;
import com.skillgap.analyzer.entity.JobRoleSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRoleSkillRepository extends JpaRepository<JobRoleSkill, Long> {
    List<JobRoleSkill> findByJobRole(JobRole jobRole);
    List<JobRoleSkill> findByJobRoleId(Long jobRoleId);
    List<JobRoleSkill> findByJobRoleIdAndImportance(Long jobRoleId, Importance importance);
    Optional<JobRoleSkill> findByJobRoleIdAndSkillId(Long jobRoleId, Long skillId);
    void deleteByJobRoleId(Long jobRoleId);

    @Query("SELECT jrs FROM JobRoleSkill jrs JOIN FETCH jrs.skill WHERE jrs.jobRole.id = :jobRoleId ORDER BY jrs.weight DESC")
    List<JobRoleSkill> findAllWithSkillByJobRoleId(@Param("jobRoleId") Long jobRoleId);
}
