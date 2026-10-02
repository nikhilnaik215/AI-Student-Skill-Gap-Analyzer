package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.StudentProfile;
import com.skillgap.analyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
    long countByTargetRoleId(Long targetRoleId);
}
