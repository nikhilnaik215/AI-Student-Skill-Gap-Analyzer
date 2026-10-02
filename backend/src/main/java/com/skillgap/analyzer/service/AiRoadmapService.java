package com.skillgap.analyzer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgap.analyzer.dto.RoadmapModuleDto;
import com.skillgap.analyzer.dto.RoadmapResponse;
import com.skillgap.analyzer.dto.SkillGapAnalysisResponse;
import com.skillgap.analyzer.entity.JobRole;
import com.skillgap.analyzer.entity.LearningRoadmap;
import com.skillgap.analyzer.entity.User;
import com.skillgap.analyzer.exception.BadRequestException;
import com.skillgap.analyzer.exception.ResourceNotFoundException;
import com.skillgap.analyzer.repository.JobRoleRepository;
import com.skillgap.analyzer.repository.LearningRoadmapRepository;
import com.skillgap.analyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AiRoadmapService {

    private final UserRepository userRepository;
    private final JobRoleRepository jobRoleRepository;
    private final LearningRoadmapRepository roadmapRepository;
    private final SkillGapAnalysisService analysisService;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    public AiRoadmapService(
            UserRepository userRepository,
            JobRoleRepository jobRoleRepository,
            LearningRoadmapRepository roadmapRepository,
            SkillGapAnalysisService analysisService,
            ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.roadmapRepository = roadmapRepository;
        this.analysisService = analysisService;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    @Transactional
    public RoadmapResponse generateRoadmap(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        SkillGapAnalysisResponse analysis = analysisService.analyzeForTargetRole(email);
        JobRole targetRole = jobRoleRepository.findById(analysis.getJobRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Target role not found"));

        List<String> missingSkillNames = analysis.getMissingSkills().stream()
                .map(s -> s.getSkillName() + " (" + s.getTargetProficiency() + ")")
                .toList();

        RoadmapResponse generated;
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                generated = generateWithGeminiApi(targetRole.getTitle(), missingSkillNames, analysis.getOverallMatchPercentage());
            } catch (Exception e) {
                System.err.println("Gemini API call failed, falling back to Expert Engine: " + e.getMessage());
                generated = generateWithExpertSystem(targetRole.getTitle(), analysis);
            }
        } else {
            generated = generateWithExpertSystem(targetRole.getTitle(), analysis);
        }

        try {
            String jsonPayload = objectMapper.writeValueAsString(generated);
            LearningRoadmap entity = new LearningRoadmap(
                    user,
                    targetRole,
                    generated.getTitle(),
                    targetRole.getTitle(),
                    jsonPayload
            );
            LearningRoadmap saved = roadmapRepository.save(entity);
            generated.setId(saved.getId());
            generated.setCreatedAt(saved.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
        } catch (Exception e) {
            throw new RuntimeException("Error persisting roadmap to database", e);
        }

        return generated;
    }

    public List<RoadmapResponse> getMyRoadmaps(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        List<LearningRoadmap> list = roadmapRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<RoadmapResponse> result = new ArrayList<>();

        for (LearningRoadmap r : list) {
            try {
                RoadmapResponse dto = objectMapper.readValue(r.getRoadmapJson(), RoadmapResponse.class);
                dto.setId(r.getId());
                dto.setCreatedAt(r.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
                result.add(dto);
            } catch (Exception ignored) {}
        }
        return result;
    }

    public RoadmapResponse getRoadmapById(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        LearningRoadmap r = roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found with ID: " + id));

        if (!r.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to this roadmap");
        }

        try {
            RoadmapResponse dto = objectMapper.readValue(r.getRoadmapJson(), RoadmapResponse.class);
            dto.setId(r.getId());
            dto.setCreatedAt(r.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
            return dto;
        } catch (Exception e) {
            throw new RuntimeException("Error parsing roadmap JSON", e);
        }
    }

    /**
     * Built-in Expert Engine: Computes a comprehensive weekly curriculum customized
     * to the student's exact missing skills and role expectations.
     */
    private RoadmapResponse generateWithExpertSystem(String roleTitle, SkillGapAnalysisResponse analysis) {
        List<RoadmapModuleDto> modules = new ArrayList<>();
        List<String> missing = analysis.getMissingSkills().stream().map(s -> s.getSkillName()).toList();

        int week = 1;

        if (roleTitle.toLowerCase().contains("java")) {
            if (missing.contains("Spring Boot") || missing.contains("RESTful APIs")) {
                modules.add(new RoadmapModuleDto(
                        week++,
                        "Spring Boot 3 Core & RESTful API Architecture",
                        "Spring Boot & RESTful APIs",
                        Arrays.asList("Inversion of Control (IoC) & Dependency Injection", "Spring MVC Architecture (@RestController, @RequestMapping)", "HTTP Methods, Status Codes & Request Validation", "Swagger / OpenAPI Documentation"),
                        Arrays.asList("Build production-ready REST controllers", "Handle input validation and global exceptions using @RestControllerAdvice"),
                        "Construct a complete CRUD REST API for a college student management system",
                        Arrays.asList("Spring.io Official Quickstart Guides", "Baeldung Spring Boot Tutorials", "freeCodeCamp Spring Boot Course")
                ));
            }

            if (missing.contains("Hibernate / JPA") || missing.contains("MySQL")) {
                modules.add(new RoadmapModuleDto(
                        week++,
                        "Data Persistence with Spring Data JPA, Hibernate & MySQL",
                        "Hibernate / JPA & MySQL",
                        Arrays.asList("JPA Entity Relationships (@OneToOne, @OneToMany, @ManyToMany)", "Spring Data JPA Repositories & Derived Queries", "Hibernate Lazy/Eager Loading & N+1 Problem Prevention", "MySQL Indexing & Transaction Management (@Transactional)"),
                        Arrays.asList("Model complex relational schemas effectively", "Execute performant queries with JPQL and Spring Data JPA"),
                        "Build an e-commerce data model with Users, Orders, and OrderItems backed by MySQL",
                        Arrays.asList("Hibernate Documentation (hibernate.org)", "Vlad Mihalcea JPA Tutorials", "MySQL 8.0 Reference Manual")
                ));
            }

            if (missing.contains("Spring Security") || missing.contains("JWT")) {
                modules.add(new RoadmapModuleDto(
                        week++,
                        "Enterprise Security & Stateless JWT Authentication",
                        "Spring Security & JWT",
                        Arrays.asList("Security Filter Chains & SecurityContextHolder", "BCrypt Password Hashing", "JWT Generation, Signing (HMAC-SHA256), and Claims Parsing", "Role-Based Access Control (@PreAuthorize, hasRole)"),
                        Arrays.asList("Secure REST endpoints with bearer token authorization", "Implement custom UserDetailsService and JWT Filters"),
                        "Add secure login, registration, and role-based permissions to your REST backend",
                        Arrays.asList("Spring Security 6 Architecture Guide", "Auth0 JWT Handbook", "Baeldung Spring Security & JWT")
                ));
            }

            if (missing.contains("Docker") || missing.contains("Microservices")) {
                modules.add(new RoadmapModuleDto(
                        week++,
                        "Containerization with Docker & Microservices Essentials",
                        "Docker & Microservices",
                        Arrays.asList("Multi-stage Dockerfile creation for Java 21 Spring Boot", "Docker Compose for running Spring Boot + MySQL + Redis", "Microservice communication (Feign Client / WebClient)", "API Gateway and centralized routing"),
                        Arrays.asList("Containerize full stack applications", "Orchestrate multi-container setups locally"),
                        "Dockerize your Spring Boot backend and MySQL database using docker-compose.yml",
                        Arrays.asList("Docker Docs for Java Developers", "Microservices.io Architecture Patterns")
                ));
            }
        } else if (roleTitle.toLowerCase().contains("web")) {
            modules.add(new RoadmapModuleDto(
                    week++,
                    "Modern React.js Fundamentals & Component Architecture",
                    "React.js & Modern ES6+",
                    Arrays.asList("Functional Components, JSX syntax", "React Hooks (useState, useEffect, useMemo, useCallback)", "Component hierarchy and Props passing", "Handling forms, inputs, and events"),
                    Arrays.asList("Build modular interactive user interfaces", "Manage state changes cleanly across component trees"),
                    "Build a task manager with filterable categories and local storage persistence",
                    Arrays.asList("React.dev Official Documentation", "Scrimba Learn React", "MDN Web Docs JavaScript")
            ));
            modules.add(new RoadmapModuleDto(
                    week++,
                    "REST API Integration & Global State Management",
                    "React & Axios Integration",
                    Arrays.asList("Axios HTTP client with request/response interceptors", "Handling loading, error, and empty states in UI", "React Router 6 (Routes, Route, useNavigate, ProtectedRoutes)", "Authentication context with JWT tokens"),
                    Arrays.asList("Connect React UI seamlessly to Spring Boot REST backends", "Secure client-side routes based on authentication status"),
                    "Connect your React application to a live backend with user login and data tables",
                    Arrays.asList("Axios GitHub Docs", "React Router Documentation")
            ));
        } else if (roleTitle.toLowerCase().contains("analyst")) {
            modules.add(new RoadmapModuleDto(
                    week++,
                    "Advanced SQL & Relational Analytics",
                    "SQL & Database Queries",
                    Arrays.asList("Complex multi-table JOINs (INNER, LEFT, FULL)", "Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD)", "Common Table Expressions (CTEs)", "Aggregations, GROUP BY, and HAVING"),
                    Arrays.asList("Solve advanced analytical data problems using pure SQL", "Generate cohort retention and monthly revenue reports"),
                    "Analyze retail transactions dataset using 15 complex business analytical queries",
                    Arrays.asList("PostgreSQL / MySQL Official Tutorial", "Mode Analytics SQL Tutorial", "LeetCode Database Challenges")
            ));
            modules.add(new RoadmapModuleDto(
                    week++,
                    "Data Wrangling with Python & Pandas",
                    "Python, Pandas & NumPy",
                    Arrays.asList("Pandas Series and DataFrames", "Data cleaning: handling nulls, type conversions, string manipulations", "GroupBy aggregations and pivot tables", "Vectorized calculations with NumPy"),
                    Arrays.asList("Prepare dirty real-world datasets for downstream reporting", "Perform automated exploratory data analysis (EDA)"),
                    "Clean and summarize a Kaggle sales and customer satisfaction dataset",
                    Arrays.asList("Pandas Official Documentation (pydata.org)", "Kaggle Learn: Pandas", "W3Schools Python")
            ));
            modules.add(new RoadmapModuleDto(
                    week++,
                    "Executive Business Intelligence Dashboards",
                    "Power BI / Tableau & Visualization",
                    Arrays.asList("Data modeling (Star Schema vs Snowflake Schema)", "DAX calculated columns and measures (SUMX, CALCULATE)", "Designing intuitive, interactive KPI dashboards", "Storytelling with data visualizations"),
                    Arrays.asList("Deliver executive-level dashboards for business stakeholders", "Translate business questions into clear visual metrics"),
                    "Create a 3-page interactive sales and customer churn dashboard in Power BI",
                    Arrays.asList("Microsoft Learn Power BI", "Tableau Public Community Dashboards")
            ));
        } else {
            // General Data Science / AI / DevOps
            modules.add(new RoadmapModuleDto(
                    week++,
                    "Core Fundamentals & Mathematical Foundations",
                    "Statistics, Probability & Python",
                    Arrays.asList("Descriptive and inferential statistics", "Distributions, hypothesis testing, p-values", "Python data structures and vectorized operations"),
                    Arrays.asList("Understand the theoretical foundations behind machine learning models", "Implement statistical tests on real datasets"),
                    "Conduct exploratory statistical analysis on medical or financial datasets",
                    Arrays.asList("StatQuest with Josh Starmer", "Khan Academy Statistics")
            ));
            modules.add(new RoadmapModuleDto(
                    week++,
                    "Supervised & Unsupervised Machine Learning",
                    "Machine Learning & Scikit-Learn",
                    Arrays.asList("Linear and Logistic Regression, Decision Trees, Random Forests", "Hyperparameter tuning using GridSearchCV", "Model evaluation: ROC-AUC, Precision, Recall, F1-Score", "Unsupervised clustering (K-Means)"),
                    Arrays.asList("Train, evaluate, and tune robust machine learning pipelines", "Prevent overfitting through cross-validation"),
                    "Build an end-to-end customer churn prediction pipeline with 85%+ accuracy",
                    Arrays.asList("Scikit-Learn Documentation", "Coursera Machine Learning by Andrew Ng")
            ));
        }

        // Add capstone review module
        modules.add(new RoadmapModuleDto(
                week,
                "Capstone Portfolio Project & Interview Preparation",
                "Full Stack Integration & Technical Viva",
                Arrays.asList("Complete full stack project integration", "Git repository documentation, README.md, and architecture diagrams", "Technical interview preparation: System design and DSA questions", "Resume enhancement showcasing completed skills"),
                Arrays.asList("Showcase production-ready artifacts to placement recruiters", "Confidently explain architectural decisions and skill mastery"),
                "Deploy your project to a public platform and publish your GitHub repository",
                Arrays.asList("GitHub Guides", "NeetCode / LeetCode Interview Prep", "Java / Full Stack Viva Question Banks")
        ));

        RoadmapResponse res = new RoadmapResponse();
        res.setTitle("AI-Generated Learning Roadmap for " + roleTitle);
        res.setTargetRoleTitle(roleTitle);
        res.setDurationWeeks(modules.size());
        res.setSummary("This customized " + modules.size() + "-week learning plan is specifically calibrated to bridge your " +
                analysis.getMissingSkills().size() + " missing skills for the " + roleTitle + " career path. Each module includes focused topics, measurable objectives, hands-on practice, and verified free resources.");
        res.setModules(modules);
        return res;
    }

    private RoadmapResponse generateWithGeminiApi(String roleTitle, List<String> missingSkills, double currentMatch) {
        String prompt = "You are an expert AI Career Mentor and Computer Science professor. " +
                "Generate a detailed, step-by-step weekly learning roadmap for a student aiming for the career role: '" + roleTitle + "'. " +
                "The student currently has a " + currentMatch + "% skill match. " +
                "Their missing or low-proficiency skills that must be learned are: " + String.join(", ", missingSkills) + ". " +
                "Respond ONLY with valid JSON with this exact structure: " +
                "{" +
                "  \"title\": \"AI Learning Roadmap for " + roleTitle + "\"," +
                "  \"targetRoleTitle\": \"" + roleTitle + "\"," +
                "  \"durationWeeks\": 6," +
                "  \"summary\": \"Brief overview of the roadmap\"," +
                "  \"modules\": [" +
                "    {" +
                "      \"week\": 1," +
                "      \"title\": \"Week Title\"," +
                "      \"focusSkill\": \"Target Skill\"," +
                "      \"keyTopics\": [\"topic1\", \"topic2\"]," +
                "      \"learningObjectives\": [\"obj1\", \"obj2\"]," +
                "      \"suggestedPractice\": \"project or exercise\"," +
                "      \"recommendedResources\": [\"resource1\", \"resource2\"]" +
                "    }" +
                "  ]" +
                "}";

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            try {
                Map<String, Object> respMap = objectMapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {});
                List<?> candidates = (List<?>) respMap.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<?, ?> cand = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> content = (Map<?, ?>) cand.get("content");
                    List<?> parts = (List<?>) content.get("parts");
                    Map<?, ?> part = (Map<?, ?>) parts.get(0);
                    String text = (String) part.get("text");

                    // Clean code fence if present
                    if (text.contains("```json")) {
                        text = text.substring(text.indexOf("```json") + 7);
                        if (text.contains("```")) {
                            text = text.substring(0, text.indexOf("```"));
                        }
                    } else if (text.contains("```")) {
                        text = text.substring(text.indexOf("```") + 3);
                        if (text.contains("```")) {
                            text = text.substring(0, text.indexOf("```"));
                        }
                    }

                    return objectMapper.readValue(text.trim(), RoadmapResponse.class);
                }
            } catch (Exception e) {
                System.err.println("Failed to parse Gemini response: " + e.getMessage());
            }
        }
        throw new RuntimeException("Gemini API invocation was unsuccessful");
    }
}
