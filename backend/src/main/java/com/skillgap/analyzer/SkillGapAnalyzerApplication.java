package com.skillgap.analyzer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SkillGapAnalyzerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillGapAnalyzerApplication.class, args);
        System.out.println("==================================================================");
        System.out.println(" AI-Powered Student Skill Gap Analyzer Backend Started Successfully ");
        System.out.println(" API Base URL:       http://localhost:8080/api                   ");
        System.out.println(" Swagger UI Docs:    http://localhost:8080/swagger-ui.html       ");
        System.out.println("==================================================================");
    }
}
