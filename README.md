# 🚀 AI-Powered Student Skill Gap Analyzer & Career Development Platform

> **A Polished, Modern, Full Stack Career Development & AI Intelligence Platform for B.Tech Final Year / Academic Projects.**  
> **Developed by Nikhil Naik** • 📧 Contact: [working.nikhinaik@gamil.com](mailto:working.nikhinaik@gamil.com) • Branding: **SkillGap.AI**

---

## 📌 Project Overview
The **AI-Powered Student Skill Gap Analyzer** is a modern, enterprise-ready career acceleration platform that helps students bridge the gap between academic education and industry expectations. It provides real-time skill benchmarking against actual job roles (*Java Developer*, *Web Developer*, *Data Analyst*, *Data Scientist*, *Cloud & DevOps Engineer*), calculates a transparent readiness percentage score, generates AI-driven learning roadmaps with verified YouTube video tutorials, provides a complete professional **Resume Builder** with PDF export, and offers an **AI ATS Resume Analyzer** with section-by-section critiques.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, Lucide Icons, Vite |
| **Styling & Themes** | Custom CSS3 Variable Design System (Light, Dark, System Theme switcher with `localStorage`) |
| **Backend** | Java 21 / 23, Spring Boot 3.3.4 (Layered Architecture: Controller → Service → Repository → Entity → MySQL) |
| **Database** | MySQL 8.0 (Relational schema with InnoDB, JPA Hibernate mapping) |
| **Security & Auth** | Spring Security 6, JJWT (Stateless JWT Bearer Auth), BCrypt Password Encryption |
| **Build Tools** | Apache Maven (Backend), npm & Vite (Frontend) |
| **API Documentation** | OpenAPI 3.0 / Swagger UI (`http://localhost:8080/swagger-ui.html`) |
| **AI Engine** | Dual Engine: Intelligent Expert Curriculum & ATS Diagnostic Engine + Optional Google Gemini API |

---

## 🌟 Upgraded Modules & Capabilities

### 1. 🎨 Theme Switcher (Light / Dark / System)
- Dedicated toggle dropdown in the navbar and mobile menu with `Sun`, `Moon`, and `Monitor` icons.
- Persistent mode saved in browser `localStorage`.
- Automatic system preference detection via `window.matchMedia('(prefers-color-scheme: dark)')`.
- Universal support across all forms, tables, modals, cards, charts, and admin panels with accessible contrast.

### 2. 🚀 Student Skill Onboarding Flow
- After registration, students are routed to a dedicated onboarding experience: *"What skills have you learned so far?"*.
- Search and category filters across 40+ skills, with quick-pick chips for popular technologies (**Java, Python, SQL, HTML5, CSS3, JavaScript, React.js, C, C++, Data Structures & Algorithms, Microsoft Excel, Machine Learning**).
- Support for adding custom skills with custom proficiency levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
- Bulk persistence into MySQL via Spring Boot REST APIs (`POST /api/student/skills/bulk`).
- Instant post-onboarding celebration modal showing the student's baseline career match score.
- Existing registered students bypass onboarding and go straight to the dashboard.

### 3. 📄 Professional Resume Builder
- Full resume creation suite for students: Personal Details, Professional Summary, Technical Skills, Projects, Work & Internship Experience, Education, and Certifications.
- **3 Professional Resume Templates**:
  1. *Modern SaaS* (Tech indigo accents, clean hierarchy)
  2. *Executive Classic* (Traditional dark navy serif/sans, high ATS readability)
  3. *Tech Minimalist* (Monospace code accents, compact developer style)
- **Live Preview Pane**: Real-time rendering as the student edits details.
- **Auto-Fill from Profile**: Instant population of contact info, education, and acquired skills with 1 click.
- **Section Reordering**: Move sections up or down (Summary, Skills, Projects, Experience, Education) with arrow controls.
- **PDF Download**: Dedicated `@media print` stylesheet formatted specifically for clean, professional A4 paper export without navigation or buttons.
- Cloud persistence in MySQL database via Spring Boot (`PUT /api/student/resume` & `GET /api/student/resume`).

### 4. 🤖 AI ATS Resume Analyzer
- Allows students to paste plain text or upload resume documents (`.txt`, `.rtf`, `.md`, `.docx`).
- "Load from My Resume Builder" button for instant 1-click evaluation of builder resumes.
- Evaluates resume content and technical keywords against target job role requirements.
- **Transparent Match Score**: Visual radial match percentage gauge with readiness verdict.
- **Section-by-Section Quality Audit**: Evaluates Contact Details, Professional Summary, Technical Projects, Skills Organization, and Education with scores (0–100), status tags, and specific feedback.
- **Constructive Improvement Suggestions**: Formulates actionable recommendations (e.g. XYZ formula for quantifiable metrics, GitHub links, ATS keyword groupings).
- **Bridge Projects**: Recommends real capstone projects from the platform database matching missing skills.
- Zero external dependency: Works 100% reliably offline via built-in expert diagnostic rules.

### 5. 🎥 Verified YouTube Learning Resources
- Verified, authentic tutorial courses from legitimate educational creators (freeCodeCamp, Programming with Mosh, Kevin Stratvert, Edureka) embedded directly for:
  - **Java**
  - **Spring Boot**
  - **SQL**
  - **Python**
  - **React.js**
  - **Microsoft Excel**
  - **Power BI**
  - **Data Structures & Algorithms**
  - **Docker**
- Integrated directly into:
  - **Skill Gap Analysis**: Each missing skill item displays its matching video tutorial card with title, channel, duration, and safe new-tab link (`target="_blank" rel="noopener noreferrer"`).
  - **AI Roadmap**: Weekly curriculum modules feature verified video courses corresponding to their focus technology.
- **Admin Configurable**: Institutional administrators can view, add, or delete YouTube learning resources from the admin portal.

### 6. 💼 SaaS UI Redesign
- Redesigned landing page with modern hero section, interactive role benchmark preview, feature cards, and 1-click demo login.
- Polished dashboard with metric tiles, radial score visualization, skill distribution badges, and quick-action cards.
- Refined navigation bar with active highlights, Lucide icons, role badge, user profile menu, and theme switcher.

---

## ⚡ Quick Start Guide (How to Run)

### 1. Prerequisites
- **Java**: JDK 21 or 23 installed
- **MySQL**: MySQL 8.0 running on `localhost:3306` (Database: `skill_gap_analyzer_db`, password: `mysql123`)
- **Node.js**: Node 18+ and npm installed

---

### 2. Running the Java Spring Boot Backend
1. Open a terminal in the `backend/` folder:
   ```powershell
   cd backend
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
   & "C:\Users\nihar\.tools\maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
   ```
2. The backend starts at **`http://localhost:8080`**.
   - **Swagger UI Interactive API Docs**: **`http://localhost:8080/swagger-ui.html`**

---

### 3. Running the React Frontend
1. Open a new terminal in the `frontend/` folder:
   ```powershell
   cd frontend
   $env:PATH = "C:\Program Files\nodejs;$env:PATH"
   npm run dev
   ```
2. Access the application in your browser at:
   👉 **`http://localhost:3000`**

---

## 🔑 Pre-Configured Demo Credentials

The backend automatically seeds verified catalog data, career roles, YouTube courses, and accounts upon startup:

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `student@skillgap.com` | `student123` | B.Tech CSE student targeting **Java Developer** with pre-loaded skills & onboarded status |
| **System Admin** | `admin@skillgap.com` | `admin123` | Full access to student roster, role manager, and YouTube resources manager |

---

## 👨‍💻 Developer & Attribution
- **Developer**: Nikhil Naik
- **Contact Email**: [working.nikhinaik@gamil.com](mailto:working.nikhinaik@gamil.com)
- **Project**: AI-Powered Student Skill Gap Analyzer (**SkillGap.AI**)
