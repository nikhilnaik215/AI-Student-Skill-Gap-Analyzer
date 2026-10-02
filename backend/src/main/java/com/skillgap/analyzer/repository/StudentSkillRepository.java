package com.skillgap.analyzer.repository;

import com.skillgap.analyzer.entity.Skill;
import com.skillgap.analyzer.entity.StudentSkill;
import com.skillgap.analyzer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByUser(User user);
    List<StudentSkill> findByUserId(Long userId);
    Optional<StudentSkill> findByUserAndSkill(User user, Skill skill);
    Optional<StudentSkill> findByUserIdAndSkillId(Long userId, Long skillId);
    boolean existsByUserIdAndSkillId(Long userId, Long skillId);
    void deleteByUserIdAndSkillId(Long userId, Long skillId);
    long countByUserId(Long userId);

    @Query("SELECT ss FROM StudentSkill ss JOIN FETCH ss.skill WHERE ss.user.id = :userId")
    List<StudentSkill> findAllWithSkillByUserId(@Param("userId") Long userId);
}
