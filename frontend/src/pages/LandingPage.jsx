import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Target,
  FolderGit2,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Code2,
  Database,
  Brain,
  Globe,
  FileText,
  ScanText,
  PlayCircle,
  Shield,
  Layers,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        {/* Modern Hero Section */}
        <div className="hero-gradient p-4 p-md-5 mb-5 shadow-lg text-center text-md-start">
          <div className="row align-items-center gy-4">
            <div className="col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 bg-white text-primary px-3 py-1.5 rounded-pill mb-3 fw-bold small text-uppercase shadow-sm">
                <Sparkles size={15} />
                <span>Modern Career Development Platform</span>
              </div>
              <h1 className="display-4 fw-extrabold mb-3 text-white" style={{ letterSpacing: '-0.5px' }}>
                Analyze Skill Gaps. Build Resumes. Land Your Target Tech Role.
              </h1>
              <p className="lead mb-4 text-white-50 fs-5" style={{ maxWidth: 660, lineHeight: '1.6' }}>
                Benchmark your competencies against real industry roles like <strong>Java Developer</strong>, <strong>Web Developer</strong>, and <strong>Data Analyst</strong>. Generate personalized AI roadmaps, build professional ATS resumes, and access verified YouTube courses.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <Link to="/register" className="btn btn-light text-primary btn-lg px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                  <span>Start Free Analysis</span>
                  <ArrowRight size={20} />
                </Link>
                <Link to="/resume-analyzer" className="btn btn-outline-light btn-lg px-4 fw-semibold d-flex align-items-center gap-2">
                  <ScanText size={20} />
                  <span>Check ATS Resume</span>
                </Link>
                <Link to="/login" className="btn btn-link text-white-50 text-decoration-none d-flex align-items-center gap-1">
                  <span>Student Login</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Live Interactive Hero Preview Card */}
            <div className="col-lg-4 text-center">
              <div className="p-4 rounded-4 shadow-lg text-start" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <span className="fw-bold small text-muted text-uppercase">Role Benchmark</span>
                  <span className="badge bg-primary text-white">Target: Java Developer</span>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between small fw-semibold mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>Overall Match Score</span>
                    <span className="text-primary fw-bold">68.5%</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: '68.5%' }}></div>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex align-items-center gap-2 text-success">
                    <CheckCircle2 size={16} /> <span>Java, SQL, Git & GitHub matched</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-warning">
                    <TrendingUp size={16} /> <span>Missing: Spring Boot, Hibernate, MySQL</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-primary">
                    <Sparkles size={16} /> <span>AI Roadmap + YouTube Tutorials ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Feature Grid */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill mb-2 fw-semibold small text-uppercase">
            Full Suite of Tools
          </span>
          <h2 className="fw-bold display-6 mb-2" style={{ color: 'var(--text-primary)' }}>
            Complete Career Development Suite
          </h2>
          <p className="text-muted" style={{ maxWidth: 620, margin: '0 auto' }}>
            Built specifically to solve the college-to-corporate employability gap through algorithmic skill comparison, AI roadmaps, and career intelligence.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {/* Feature 1: Skill Gap Engine */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 p-4 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="bg-primary text-white p-3 rounded-3 d-inline-flex mb-3 shadow-xs" style={{ width: 'fit-content' }}>
                <Target size={24} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Skill Gap Diagnostic</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Compares your acquired skills with target career role requirements, calculates a transparent percentage score, and highlights critical missing proficiencies.
              </p>
            </div>
          </div>

          {/* Feature 2: AI Roadmap Generator */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 p-4 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="bg-warning text-white p-3 rounded-3 d-inline-flex mb-3 shadow-xs" style={{ width: 'fit-content' }}>
                <Sparkles size={24} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>AI Learning Roadmaps</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Generates a customized week-by-week curriculum tailored directly to your missing skills, with focus areas, practice exercises, and curated documentation.
              </p>
            </div>
          </div>

          {/* Feature 3: Resume Builder */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 p-4 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="bg-success text-white p-3 rounded-3 d-inline-flex mb-3 shadow-xs" style={{ width: 'fit-content' }}>
                <FileText size={24} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Modern Resume Builder</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Build clean, ATS-friendly resumes with 3 professional templates (Modern SaaS, Executive Classic, Tech Minimalist), section reordering, and direct PDF download.
              </p>
            </div>
          </div>

          {/* Feature 4: AI Resume Analyzer */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 p-4 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="bg-info text-white p-3 rounded-3 d-inline-flex mb-3 shadow-xs" style={{ width: 'fit-content' }}>
                <ScanText size={24} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>AI ATS Resume Analyzer</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Paste or upload your resume for instant ATS parsing, role alignment scoring, section-by-section critiques, and actionable suggestions to improve interview conversion.
              </p>
            </div>
          </div>

          {/* Feature 5: YouTube Learning Resources */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 p-4 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="bg-danger text-white p-3 rounded-3 d-inline-flex mb-3 shadow-xs" style={{ width: 'fit-content' }}>
                <PlayCircle size={24} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Verified YouTube Courses</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Integrated video tutorials from world-class educators for Java, Spring Boot, SQL, Python, React, Excel, and Data Structures, embedded directly into your missing skill items.
              </p>
            </div>
          </div>

          {/* Feature 6: Recommended Projects */}
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 p-4 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="bg-secondary text-white p-3 rounded-3 d-inline-flex mb-3 shadow-xs" style={{ width: 'fit-content' }}>
                <FolderGit2 size={24} />
              </div>
              <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Portfolio Project Blueprints</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: '1.6' }}>
                Bridge your gaps through hands-on capstone projects matching your exact target role and missing technologies, with tech stacks and estimated timelines.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Footer Card */}
        <div className="card border p-5 text-center shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <h3 className="fw-bolder mb-2" style={{ color: 'var(--text-primary)' }}>
            Ready to Accelerate Your Tech Career?
          </h3>
          <p className="text-muted small mb-4" style={{ maxWidth: 520, margin: '0 auto' }}>
            Set up your profile, select your skills, and get your AI readiness benchmark in less than 2 minutes.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-primary px-4 py-2.5 shadow-sm fw-semibold">
              Create Free Account &rarr;
            </Link>
            <Link to="/resume-analyzer" className="btn btn-outline-primary px-4 py-2.5 fw-semibold">
              Scan Resume Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
