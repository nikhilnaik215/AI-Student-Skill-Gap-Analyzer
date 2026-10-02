package com.skillgap.analyzer.config;

import com.skillgap.analyzer.entity.*;
import com.skillgap.analyzer.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final JobRoleRepository jobRoleRepository;
    private final JobRoleSkillRepository jobRoleSkillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ProjectRecommendationRepository projectRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            StudentProfileRepository profileRepository,
            SkillRepository skillRepository,
            JobRoleRepository jobRoleRepository,
            JobRoleSkillRepository jobRoleSkillRepository,
            StudentSkillRepository studentSkillRepository,
            ProjectRecommendationRepository projectRepository,
            LearningResourceRepository learningResourceRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.jobRoleRepository = jobRoleRepository;
        this.jobRoleSkillRepository = jobRoleSkillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.projectRepository = projectRepository;
        this.learningResourceRepository = learningResourceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (jobRoleRepository.count() == 0) {
            System.out.println("Seeding initial database data for AI-Powered Student Skill Gap Analyzer...");

            // 1. Seed Skills Catalog
            Map<String, Skill> skills = seedSkills();

            // 2. Seed Career Roles & Required Skills
            Map<String, JobRole> roles = seedJobRolesWithSkills(skills);

            // 3. Seed Users (Admin & Demo Student)
            seedUsersAndDemoStudent(roles, skills);

            // 4. Seed Project Recommendations
            seedProjects(roles, skills);

            System.out.println("Initial core data initialization completed successfully!");
        }

        // Incremental seeds that apply even if core DB was initialized earlier
        seedMissingSkills();
        seedLearningResources();
        ensureStudentOnboardingFlag();
    }

    private Map<String, Skill> seedSkills() {
        Map<String, Skill> map = new HashMap<>();

        // Programming Languages
        addSkill(map, "Java", SkillCategory.PROGRAMMING, "Core Java, OOP, Collections, Multithreading, Exception Handling, Streams API");
        addSkill(map, "Python", SkillCategory.PROGRAMMING, "Python syntax, data structures, functional programming, OOP, scripting");
        addSkill(map, "JavaScript", SkillCategory.PROGRAMMING, "Modern ES6+, closures, async/await, DOM manipulation, promises");
        addSkill(map, "TypeScript", SkillCategory.PROGRAMMING, "Typed superset of JavaScript, interfaces, generics, type guards");
        addSkill(map, "SQL", SkillCategory.DATABASE, "Relational queries, JOINs, indexing, transactions, aggregations, subqueries");

        // Backend & Frameworks
        addSkill(map, "Spring Boot", SkillCategory.FRAMEWORK, "Spring Core, Dependency Injection, REST controllers, Spring Security, Actuator");
        addSkill(map, "Hibernate / JPA", SkillCategory.FRAMEWORK, "Object-Relational Mapping, entity lifecycle, JPQL, relationships, caching");
        addSkill(map, "RESTful APIs", SkillCategory.SOFTWARE_ENGINEERING, "API design, HTTP verbs, status codes, JSON serialization, OpenAPI/Swagger");
        addSkill(map, "Microservices", SkillCategory.SOFTWARE_ENGINEERING, "Service discovery, API Gateway, circuit breaker, distributed architectures");

        // Databases
        addSkill(map, "MySQL", SkillCategory.DATABASE, "Schema design, relational constraints, stored procedures, indexing optimization");
        addSkill(map, "PostgreSQL", SkillCategory.DATABASE, "Advanced SQL, ACID transactions, JSONB, indexing strategies");
        addSkill(map, "MongoDB", SkillCategory.DATABASE, "NoSQL document store, aggregation pipeline, replica sets, BSON");
        addSkill(map, "Redis", SkillCategory.DATABASE, "In-memory caching, pub/sub, key-value data structures, session storage");

        // Frontend
        addSkill(map, "React.js", SkillCategory.WEB_DEVELOPMENT, "Component hierarchy, hooks (useState, useEffect, useContext), state management, JSX");
        addSkill(map, "HTML5", SkillCategory.WEB_DEVELOPMENT, "Semantic HTML, web accessibility, forms, modern web standards");
        addSkill(map, "CSS3", SkillCategory.WEB_DEVELOPMENT, "Flexbox, CSS Grid, responsive design, media queries, animations");
        addSkill(map, "Bootstrap", SkillCategory.WEB_DEVELOPMENT, "Bootstrap grid system, utility classes, responsive UI components");
        addSkill(map, "Tailwind CSS", SkillCategory.WEB_DEVELOPMENT, "Utility-first CSS framework, responsive styling, design system");

        // Data Science & AI/ML
        addSkill(map, "Pandas", SkillCategory.AI_DATA_SCIENCE, "DataFrames, data cleaning, aggregation, exploratory data analysis, transformation");
        addSkill(map, "NumPy", SkillCategory.AI_DATA_SCIENCE, "N-dimensional arrays, linear algebra, vectorization, numerical computation");
        addSkill(map, "Data Visualization", SkillCategory.AI_DATA_SCIENCE, "Matplotlib, Seaborn, charting best practices, visual storytelling");
        addSkill(map, "Power BI", SkillCategory.AI_DATA_SCIENCE, "Interactive dashboards, DAX expressions, data modeling, reporting");
        addSkill(map, "Tableau", SkillCategory.AI_DATA_SCIENCE, "Visual analytics, calculation fields, dashboard design, business intelligence");
        addSkill(map, "Machine Learning", SkillCategory.AI_DATA_SCIENCE, "Supervised & unsupervised learning, scikit-learn, regression, classification, clustering");
        addSkill(map, "Deep Learning", SkillCategory.AI_DATA_SCIENCE, "Neural networks, CNNs, RNNs, TensorFlow, PyTorch, backpropagation");
        addSkill(map, "Natural Language Processing", SkillCategory.AI_DATA_SCIENCE, "Text preprocessing, tokenization, transformers, LLMs, embeddings");
        addSkill(map, "Feature Engineering", SkillCategory.AI_DATA_SCIENCE, "Handling missing values, encoding, scaling, dimensionality reduction (PCA)");
        addSkill(map, "Statistics & Probability", SkillCategory.AI_DATA_SCIENCE, "Hypothesis testing, distributions, p-values, regression analysis");

        // DevOps & Cloud
        addSkill(map, "Git & GitHub", SkillCategory.TOOLS_VERSION_CONTROL, "Branching strategies, pull requests, merge conflict resolution, CI integration");
        addSkill(map, "Docker", SkillCategory.CLOUD_DEVOPS, "Containerization, Dockerfile creation, multi-stage builds, Docker Compose");
        addSkill(map, "Kubernetes", SkillCategory.CLOUD_DEVOPS, "Container orchestration, Pods, Deployments, Services, ConfigMaps, Ingress");
        addSkill(map, "AWS Cloud", SkillCategory.CLOUD_DEVOPS, "EC2, S3, RDS, Lambda, IAM, VPC, cloud deployment architecture");
        addSkill(map, "CI/CD Pipelines", SkillCategory.CLOUD_DEVOPS, "GitHub Actions, automated testing, continuous integration and deployment");

        // Software Engineering & Soft Skills
        addSkill(map, "Data Structures & Algorithms", SkillCategory.SOFTWARE_ENGINEERING, "Arrays, linked lists, trees, graphs, sorting, searching, time/space complexity");
        addSkill(map, "Unit Testing (JUnit)", SkillCategory.SOFTWARE_ENGINEERING, "Test-driven development, mocking with Mockito, test coverage, assertions");
        addSkill(map, "Problem Solving", SkillCategory.SOFT_SKILLS, "Algorithmic thinking, debugging complex issues, root cause analysis");
        addSkill(map, "Agile & Scrum", SkillCategory.SOFT_SKILLS, "Sprints, standups, backlog refinement, user stories, retrospectives");

        return map;
    }

    private void addSkill(Map<String, Skill> map, String name, SkillCategory category, String description) {
        Skill skill = skillRepository.save(new Skill(name, category, description));
        map.put(name, skill);
    }

    private Map<String, JobRole> seedJobRolesWithSkills(Map<String, Skill> skills) {
        Map<String, JobRole> map = new HashMap<>();

        // Role 1: Java Developer
        JobRole javaDev = jobRoleRepository.save(new JobRole(
                "Java Developer",
                "Designs, builds, and maintains enterprise backend applications, robust microservices, and secure REST APIs using Java, Spring Boot, Hibernate, and relational databases.",
                IndustryDemand.VERY_HIGH,
                "₹6,00,000 - ₹14,00,000 / year",
                "code"
        ));
        map.put("Java Developer", javaDev);

        addRoleSkill(javaDev, skills.get("Java"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(javaDev, skills.get("Spring Boot"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 5);
        addRoleSkill(javaDev, skills.get("Hibernate / JPA"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(javaDev, skills.get("RESTful APIs"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(javaDev, skills.get("MySQL"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(javaDev, skills.get("SQL"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(javaDev, skills.get("Git & GitHub"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 3);
        addRoleSkill(javaDev, skills.get("Unit Testing (JUnit)"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 3);
        addRoleSkill(javaDev, skills.get("Data Structures & Algorithms"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(javaDev, skills.get("Docker"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);
        addRoleSkill(javaDev, skills.get("Microservices"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);
        addRoleSkill(javaDev, skills.get("Redis"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 2);

        // Role 2: Web Developer
        JobRole webDev = jobRoleRepository.save(new JobRole(
                "Web Developer",
                "Constructs engaging, responsive, and high-performance full-stack web applications utilizing React.js, modern JavaScript/TypeScript, HTML5/CSS3, and REST API integration.",
                IndustryDemand.VERY_HIGH,
                "₹5,00,000 - ₹12,00,000 / year",
                "globe"
        ));
        map.put("Web Developer", webDev);

        addRoleSkill(webDev, skills.get("HTML5"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(webDev, skills.get("CSS3"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(webDev, skills.get("JavaScript"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(webDev, skills.get("React.js"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 5);
        addRoleSkill(webDev, skills.get("Bootstrap"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(webDev, skills.get("RESTful APIs"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(webDev, skills.get("Git & GitHub"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 3);
        addRoleSkill(webDev, skills.get("SQL"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);
        addRoleSkill(webDev, skills.get("TypeScript"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);
        addRoleSkill(webDev, skills.get("Tailwind CSS"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);

        // Role 3: Data Analyst
        JobRole dataAnalyst = jobRoleRepository.save(new JobRole(
                "Data Analyst",
                "Transforms raw data into strategic business insights using advanced SQL queries, Python data analysis libraries, and business intelligence dashboards (Power BI / Tableau).",
                IndustryDemand.HIGH,
                "₹5,50,000 - ₹11,00,000 / year",
                "bar-chart-2"
        ));
        map.put("Data Analyst", dataAnalyst);

        addRoleSkill(dataAnalyst, skills.get("SQL"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(dataAnalyst, skills.get("Python"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(dataAnalyst, skills.get("Pandas"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 5);
        addRoleSkill(dataAnalyst, skills.get("NumPy"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(dataAnalyst, skills.get("Data Visualization"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(dataAnalyst, skills.get("Power BI"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(dataAnalyst, skills.get("Statistics & Probability"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(dataAnalyst, skills.get("Tableau"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);
        addRoleSkill(dataAnalyst, skills.get("MySQL"), Importance.PREFERRED, ProficiencyLevel.INTERMEDIATE, 3);

        // Role 4: Data Scientist
        JobRole dataScientist = jobRoleRepository.save(new JobRole(
                "Data Scientist",
                "Extracts predictive value from complex datasets by developing statistical models, machine learning pipelines, deep learning algorithms, and exploratory data science workflows.",
                IndustryDemand.VERY_HIGH,
                "₹8,00,000 - ₹18,00,000 / year",
                "brain"
        ));
        map.put("Data Scientist", dataScientist);

        addRoleSkill(dataScientist, skills.get("Python"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(dataScientist, skills.get("Machine Learning"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(dataScientist, skills.get("Pandas"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(dataScientist, skills.get("NumPy"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 4);
        addRoleSkill(dataScientist, skills.get("Statistics & Probability"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(dataScientist, skills.get("Feature Engineering"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(dataScientist, skills.get("SQL"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(dataScientist, skills.get("Deep Learning"), Importance.PREFERRED, ProficiencyLevel.INTERMEDIATE, 4);
        addRoleSkill(dataScientist, skills.get("Natural Language Processing"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);
        addRoleSkill(dataScientist, skills.get("Docker"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);

        // Role 5: Cloud & DevOps Engineer
        JobRole devops = jobRoleRepository.save(new JobRole(
                "Cloud & DevOps Engineer",
                "Builds resilient infrastructure, automates CI/CD delivery pipelines, manages containerized services, and enforces security and scalability on cloud platforms.",
                IndustryDemand.VERY_HIGH,
                "₹7,00,000 - ₹16,00,000 / year",
                "cloud"
        ));
        map.put("Cloud & DevOps Engineer", devops);

        addRoleSkill(devops, skills.get("Docker"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(devops, skills.get("Kubernetes"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 5);
        addRoleSkill(devops, skills.get("AWS Cloud"), Importance.REQUIRED, ProficiencyLevel.INTERMEDIATE, 5);
        addRoleSkill(devops, skills.get("CI/CD Pipelines"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 5);
        addRoleSkill(devops, skills.get("Git & GitHub"), Importance.REQUIRED, ProficiencyLevel.ADVANCED, 4);
        addRoleSkill(devops, skills.get("Python"), Importance.PREFERRED, ProficiencyLevel.BEGINNER, 3);

        return map;
    }

    private void addRoleSkill(JobRole role, Skill skill, Importance importance, ProficiencyLevel minProficiency, int weight) {
        if (skill != null) {
            jobRoleSkillRepository.save(new JobRoleSkill(role, skill, importance, minProficiency, weight));
        }
    }

    private void seedUsersAndDemoStudent(Map<String, JobRole> roles, Map<String, Skill> skills) {
        // Admin
        User admin = new User(
                "System Administrator",
                "admin@skillgap.com",
                passwordEncoder.encode("admin123"),
                Role.ROLE_ADMIN
        );
        userRepository.save(admin);

        // Student
        User student = new User(
                "Nihar Sharma",
                "student@skillgap.com",
                passwordEncoder.encode("student123"),
                Role.ROLE_STUDENT
        );
        student = userRepository.save(student);

        // Student Profile targeting Java Developer
        JobRole targetRole = roles.get("Java Developer");
        StudentProfile profile = new StudentProfile(student);
        profile.setCollege("Institute of Engineering and Technology");
        profile.setDegree("B.Tech in Computer Science & Engineering");
        profile.setGraduationYear(2025);
        profile.setPhone("+91 9876543210");
        profile.setBio("Final-year B.Tech CSE student passionate about enterprise software development, Spring Boot microservices, and cloud systems.");
        profile.setTargetRole(targetRole);
        profile.setGithubUrl("https://github.com/example-student");
        profile.setLinkedinUrl("https://linkedin.com/in/example-student");
        profileRepository.save(profile);

        // Add some initial skills to demo student (partial match for Java Developer)
        // Has: Java (Intermediate), SQL (Beginner), HTML5 (Intermediate), CSS3 (Beginner), Git (Beginner)
        // Missing: Spring Boot, Hibernate / JPA, RESTful APIs, MySQL, Unit Testing, Data Structures
        addStudentSkill(student, skills.get("Java"), ProficiencyLevel.INTERMEDIATE, 1);
        addStudentSkill(student, skills.get("SQL"), ProficiencyLevel.BEGINNER, 1);
        addStudentSkill(student, skills.get("HTML5"), ProficiencyLevel.INTERMEDIATE, 1);
        addStudentSkill(student, skills.get("CSS3"), ProficiencyLevel.BEGINNER, 1);
        addStudentSkill(student, skills.get("Git & GitHub"), ProficiencyLevel.BEGINNER, 1);
    }

    private void addStudentSkill(User user, Skill skill, ProficiencyLevel level, int years) {
        if (skill != null) {
            studentSkillRepository.save(new StudentSkill(user, skill, level, years));
        }
    }

    private void seedProjects(Map<String, JobRole> roles, Map<String, Skill> skills) {
        // Project 1: Spring Boot E-Commerce REST API
        ProjectRecommendation p1 = new ProjectRecommendation(
                "Enterprise E-Commerce REST API Backend",
                "Build a modular, enterprise-grade e-commerce backend service with Spring Boot, Spring Security JWT authentication, product catalog, cart management, and order processing with MySQL persistence.",
                DifficultyLevel.INTERMEDIATE,
                "Java 21, Spring Boot 3, Spring Data JPA, MySQL, Spring Security, JWT, Swagger",
                "2 - 3 Weeks",
                "Master Spring Boot architecture, relational modeling with Hibernate, JWT stateless auth, and REST design patterns.",
                roles.get("Java Developer")
        );
        p1.getTargetSkills().addAll(Arrays.asList(
                skills.get("Spring Boot"),
                skills.get("Hibernate / JPA"),
                skills.get("RESTful APIs"),
                skills.get("MySQL"),
                skills.get("Java")
        ));
        projectRepository.save(p1);

        // Project 2: Microservices Order Management System
        ProjectRecommendation p2 = new ProjectRecommendation(
                "Distributed Microservices Order Processing System",
                "Construct decoupled microservices for customer orders, inventory checks, and payment notification using Spring Cloud, Docker containers, and Redis caching.",
                DifficultyLevel.ADVANCED,
                "Java, Spring Boot, Spring Cloud, Docker, Redis, MySQL",
                "3 - 4 Weeks",
                "Gain practical understanding of distributed systems, service communication, and container deployment.",
                roles.get("Java Developer")
        );
        p2.getTargetSkills().addAll(Arrays.asList(
                skills.get("Microservices"),
                skills.get("Docker"),
                skills.get("Redis"),
                skills.get("Spring Boot")
        ));
        projectRepository.save(p2);

        // Project 3: React Full Stack Task & Project Manager
        ProjectRecommendation p3 = new ProjectRecommendation(
                "Modern Kanban Project Management Web Application",
                "Develop an interactive Kanban board task management system with drag-and-drop cards, column categorization, user assignment, and responsive UI built with React and Bootstrap.",
                DifficultyLevel.BEGINNER,
                "React.js, JavaScript, HTML5, CSS3, Bootstrap 5, REST API",
                "1 - 2 Weeks",
                "Strengthen React state management, component lifecycles, responsive layouts, and REST client integration.",
                roles.get("Web Developer")
        );
        p3.getTargetSkills().addAll(Arrays.asList(
                skills.get("React.js"),
                skills.get("JavaScript"),
                skills.get("HTML5"),
                skills.get("CSS3"),
                skills.get("Bootstrap")
        ));
        projectRepository.save(p3);

        // Project 4: Interactive Sales & Business Intelligence Dashboard
        ProjectRecommendation p4 = new ProjectRecommendation(
                "E-Commerce Sales Performance BI Dashboard",
                "Clean real-world retail transaction data with Pandas, compute key performance indicators (KPIs), and construct an interactive multi-page dashboard in Power BI.",
                DifficultyLevel.INTERMEDIATE,
                "Python, Pandas, NumPy, Power BI, SQL",
                "1 - 2 Weeks",
                "Learn exploratory data analysis, data cleaning pipelines, DAX formulas, and executive visualization techniques.",
                roles.get("Data Analyst")
        );
        p4.getTargetSkills().addAll(Arrays.asList(
                skills.get("SQL"),
                skills.get("Pandas"),
                skills.get("NumPy"),
                skills.get("Power BI"),
                skills.get("Data Visualization")
        ));
        projectRepository.save(p4);

        // Project 5: Customer Churn Prediction ML System
        ProjectRecommendation p5 = new ProjectRecommendation(
                "End-to-End Customer Churn Prediction Engine",
                "Develop an end-to-end machine learning system that predicts telecom customer churn using Scikit-Learn, featuring feature selection, hyperparameter tuning, and model evaluation metrics.",
                DifficultyLevel.ADVANCED,
                "Python, Scikit-learn, Pandas, NumPy, Statistics, Feature Engineering",
                "2 - 3 Weeks",
                "Master supervised classification algorithms, ROC-AUC curve analysis, confusion matrices, and feature importance.",
                roles.get("Data Scientist")
        );
        p5.getTargetSkills().addAll(Arrays.asList(
                skills.get("Machine Learning"),
                skills.get("Feature Engineering"),
                skills.get("Statistics & Probability"),
                skills.get("Python"),
                skills.get("Pandas")
        ));
        projectRepository.save(p5);
    }

    private void seedMissingSkills() {
        if (!skillRepository.existsByNameIgnoreCase("C")) {
            skillRepository.save(new Skill("C", SkillCategory.PROGRAMMING, "Procedural programming, pointers, low-level memory allocation, standard C library"));
        }
        if (!skillRepository.existsByNameIgnoreCase("C++")) {
            skillRepository.save(new Skill("C++", SkillCategory.PROGRAMMING, "Object-oriented C++, STL containers, templates, RAII, memory management"));
        }
        if (!skillRepository.existsByNameIgnoreCase("Microsoft Excel")) {
            skillRepository.save(new Skill("Microsoft Excel", SkillCategory.AI_DATA_SCIENCE, "Formulas, VLOOKUP, XLOOKUP, Pivot Tables, conditional formatting, data analysis"));
        }
    }

    private void seedLearningResources() {
        if (learningResourceRepository.count() > 0) {
            return;
        }

        List<LearningResource> resources = new ArrayList<>();

        // Java
        Skill javaSkill = skillRepository.findByNameIgnoreCase("Java").orElse(null);
        resources.add(new LearningResource(
                javaSkill, "Java",
                "Java Full Course for Beginners | 2024",
                "Core Java & OOP",
                "Programming with Mosh",
                "https://www.youtube.com/watch?v=eIrMbG6442k",
                "2.5 Hours",
                DifficultyLevel.BEGINNER
        ));

        // Spring Boot
        Skill springSkill = skillRepository.findByNameIgnoreCase("Spring Boot").orElse(null);
        resources.add(new LearningResource(
                springSkill, "Spring Boot",
                "Spring Boot Full Course - Learn Spring Boot in 4 Hours",
                "Spring Boot Framework & REST APIs",
                "freeCodeCamp.org",
                "https://www.youtube.com/watch?v=35EQXmHKZYs",
                "4 Hours",
                DifficultyLevel.INTERMEDIATE
        ));

        // SQL
        Skill sqlSkill = skillRepository.findByNameIgnoreCase("SQL").orElse(null);
        resources.add(new LearningResource(
                sqlSkill, "SQL",
                "SQL Tutorial - Full Database Course for Beginners",
                "SQL Queries, Joins & Relational Databases",
                "freeCodeCamp.org",
                "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                "4.3 Hours",
                DifficultyLevel.BEGINNER
        ));

        // Python
        Skill pythonSkill = skillRepository.findByNameIgnoreCase("Python").orElse(null);
        resources.add(new LearningResource(
                pythonSkill, "Python",
                "Python for Beginners - Full Course",
                "Python Syntax, Functions & OOP",
                "Programming with Mosh",
                "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                "6 Hours",
                DifficultyLevel.BEGINNER
        ));

        // React
        Skill reactSkill = skillRepository.findByNameIgnoreCase("React.js").orElse(null);
        resources.add(new LearningResource(
                reactSkill, "React.js",
                "React Course - Beginner's Tutorial for React JavaScript Library",
                "React Components, Hooks & State",
                "freeCodeCamp.org",
                "https://www.youtube.com/watch?v=bMknfKXIFA8",
                "11 Hours",
                DifficultyLevel.INTERMEDIATE
        ));

        // Microsoft Excel
        Skill excelSkill = skillRepository.findByNameIgnoreCase("Microsoft Excel").orElse(null);
        resources.add(new LearningResource(
                excelSkill, "Microsoft Excel",
                "Excel Tutorial for Beginners - Full Course",
                "Excel Formulas, Pivot Tables & Data Analysis",
                "Kevin Stratvert",
                "https://www.youtube.com/watch?v=k1VUZEVuDJ8",
                "3.5 Hours",
                DifficultyLevel.BEGINNER
        ));

        // Power BI
        Skill pbiSkill = skillRepository.findByNameIgnoreCase("Power BI").orElse(null);
        resources.add(new LearningResource(
                pbiSkill, "Power BI",
                "Power BI Full Course - Learn Power BI in 4 Hours",
                "Power BI Dashboards, DAX & Data Modeling",
                "Edureka",
                "https://www.youtube.com/watch?v=3u7UDf1eH78",
                "4 Hours",
                DifficultyLevel.INTERMEDIATE
        ));

        // Data Structures & Algorithms
        Skill dsaSkill = skillRepository.findByNameIgnoreCase("Data Structures & Algorithms").orElse(null);
        resources.add(new LearningResource(
                dsaSkill, "Data Structures & Algorithms",
                "Data Structures and Algorithms for Beginners",
                "Arrays, Trees, Graphs & Algorithm Complexity",
                "Programming with Mosh",
                "https://www.youtube.com/watch?v=BBpAmxU_NQo",
                "1.5 Hours",
                DifficultyLevel.INTERMEDIATE
        ));

        // Docker
        Skill dockerSkill = skillRepository.findByNameIgnoreCase("Docker").orElse(null);
        resources.add(new LearningResource(
                dockerSkill, "Docker",
                "Docker Tutorial for Beginners [Full Course]",
                "Containers, Dockerfiles & Compose",
                "TechWorld with Nana",
                "https://www.youtube.com/watch?v=3c-iBn73dDE",
                "3 Hours",
                DifficultyLevel.BEGINNER
        ));

        learningResourceRepository.saveAll(resources);
        System.out.println("Seeded " + resources.size() + " verified YouTube educational learning resources.");
    }

    private void ensureStudentOnboardingFlag() {
        userRepository.findByEmail("student@skillgap.com").ifPresent(user -> {
            profileRepository.findByUser(user).ifPresent(profile -> {
                if (profile.getOnboardingCompleted() == null || !profile.getOnboardingCompleted()) {
                    profile.setOnboardingCompleted(true);
                    profileRepository.save(profile);
                }
            });
        });
    }
}
