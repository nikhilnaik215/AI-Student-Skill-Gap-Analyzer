package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    Optional<JobRole> findByTitleIgnoreCase(String title);
    Boolean existsByTitleIgnoreCase(String title);
}
