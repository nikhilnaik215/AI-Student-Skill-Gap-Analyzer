package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.StudentResume;
import com.skillgap.analyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentResumeRepository extends JpaRepository<StudentResume, Long> {
    Optional<StudentResume> findByUser(User user);
    Optional<StudentResume> findByUserId(Long userId);
}
