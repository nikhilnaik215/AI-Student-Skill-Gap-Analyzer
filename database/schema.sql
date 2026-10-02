-- ====================================================================
-- AI-Powered Student Skill Gap Analyzer - MySQL Database Schema & Seed Script
-- B.Tech Final Year / Academic Project
-- Technology: MySQL 8.0, Spring Data JPA / Hibernate
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `skill_gap_analyzer_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skill_gap_analyzer_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT',
    `created_at` DATETIME NOT NULL
) ENGINE=InnoDB;

-- 2. Career Roles Table
CREATE TABLE IF NOT EXISTS `job_roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT,
    `industry_demand` VARCHAR(50) NOT NULL DEFAULT 'HIGH',
    `avg_salary` VARCHAR(255),
    `icon` VARCHAR(100)
) ENGINE=InnoDB;

-- 3. Skills Catalog Table
CREATE TABLE IF NOT EXISTS `skills` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `category` VARCHAR(100) NOT NULL,
    `description` TEXT
) ENGINE=InnoDB;

-- 4. Student Profiles Table
CREATE TABLE IF NOT EXISTS `student_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `phone` VARCHAR(50),
    `college` VARCHAR(255),
    `degree` VARCHAR(255),
    `graduation_year` INT,
    `bio` TEXT,
    `target_role_id` BIGINT,
    `linkedin_url` VARCHAR(255),
    `github_url` VARCHAR(255),
    CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_profile_target_role` FOREIGN KEY (`target_role_id`) REFERENCES `job_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Student Skills Table
CREATE TABLE IF NOT EXISTS `student_skills` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `skill_id` BIGINT NOT NULL,
    `proficiency` VARCHAR(50) NOT NULL DEFAULT 'BEGINNER',
    `years_of_experience` INT DEFAULT 0,
    UNIQUE KEY `uk_student_skill` (`user_id`, `skill_id`),
    CONSTRAINT `fk_studentskill_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_studentskill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Job Role Required Skills Table
CREATE TABLE IF NOT EXISTS `job_role_skills` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `job_role_id` BIGINT NOT NULL,
    `skill_id` BIGINT NOT NULL,
    `importance` VARCHAR(50) NOT NULL DEFAULT 'REQUIRED',
    `min_proficiency` VARCHAR(50) NOT NULL DEFAULT 'INTERMEDIATE',
    `weight` INT NOT NULL DEFAULT 3,
    UNIQUE KEY `uk_jobrole_skill` (`job_role_id`, `skill_id`),
    CONSTRAINT `fk_roleskill_role` FOREIGN KEY (`job_role_id`) REFERENCES `job_roles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_roleskill_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Project Recommendations Table
CREATE TABLE IF NOT EXISTS `project_recommendations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `difficulty` VARCHAR(50) NOT NULL DEFAULT 'INTERMEDIATE',
    `tech_stack` VARCHAR(255),
    `estimated_duration` VARCHAR(100),
    `learning_outcomes` TEXT,
    `job_role_id` BIGINT,
    CONSTRAINT `fk_project_role` FOREIGN KEY (`job_role_id`) REFERENCES `job_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. Project Target Skills (ManyToMany Join Table)
CREATE TABLE IF NOT EXISTS `project_target_skills` (
    `project_id` BIGINT NOT NULL,
    `skill_id` BIGINT NOT NULL,
    PRIMARY KEY (`project_id`, `skill_id`),
    CONSTRAINT `fk_pts_project` FOREIGN KEY (`project_id`) REFERENCES `project_recommendations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pts_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. AI Learning Roadmaps Table
CREATE TABLE IF NOT EXISTS `learning_roadmaps` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `job_role_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `target_role_title` VARCHAR(255) NOT NULL,
    `roadmap_json` LONGTEXT NOT NULL,
    `created_at` DATETIME NOT NULL,
    CONSTRAINT `fk_roadmap_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_roadmap_role` FOREIGN KEY (`job_role_id`) REFERENCES `job_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Note: The Spring Boot application automatically populates and verifies
-- these tables and default data upon initial startup via DataInitializer.java.
