import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisApi, studentSkillsApi, roadmapApi, projectsApi } from '../services/api';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FolderGit2,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  RefreshCw,
  FileText,
  ScanText,
  Briefcase
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [mySkillsCount, setMySkillsCount] = useState(0);
  const [roadmapsCount, setRoadmapsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Skill Gap Analysis for Target Role
      try {
        const analysisRes = await analysisApi.analyzeTargetRole();
        if (analysisRes.data?.success) {
          setAnalysis(analysisRes.data.data);
        }
      } catch (err) {
        console.warn('Target role analysis not available yet:', err.message);
      }

      // 2. Student Skills count
      try {
        const skillsRes = await studentSkillsApi.getMySkills();
        if (skillsRes.data?.success) {
          setMySkillsCount(skillsRes.data.data.length);
        }
      } catch (err) {}

      // 3. Roadmaps count
      try {
        const roadmapsRes = await roadmapApi.getMyRoadmaps();
        if (roadmapsRes.data?.success) {
          setRoadmapsCount(roadmapsRes.data.data.length);
        }
      } catch (err) {}

      // 4. Projects count
      try {
        const projRes = await projectsApi.getRecommendedProjects();
        if (projRes.data?.success) {
          setProjectsCount(projRes.data.data.length);
        }
      } catch (err) {}
    } catch (err) {
      setError('Failed to load dashboard metrics. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
        <p className="text-muted">Analyzing your skills and career benchmark...</p>
      </div>
    );
  }

  const matchScore = analysis?.overallMatchPercentage || 0;
  const matchClass = matchScore >= 80 ? 'match-high' : matchScore >= 50 ? 'match-mid' : 'match-low';

  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        {/* Top Welcome Header */}
        <div className="row align-items-center mb-4 gy-3">
          <div className="col-md-8">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-2 fw-semibold px-2.5 py-1">
              Student Career Dashboard
            </span>
            <h2 className="fw-bolder mb-1" style={{ color: 'var(--text-primary)' }}>
              Welcome, {user?.fullName || 'Student'}! 👋
            </h2>
            <p className="text-muted mb-0">
              Target Career: <strong className="text-primary">{analysis?.jobRoleTitle || user?.targetRoleTitle || 'Select in Profile'}</strong>
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <button
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1.5"
              onClick={loadDashboardData}
            >
              <RefreshCw size={14} /> Refresh Analysis
            </button>
          </div>
        </div>

        {/* Missing Target Role Prompt */}
        {!analysis && (
          <div className="alert alert-warning border-0 rounded-4 p-4 mb-4 shadow-sm">
            <div className="d-flex align-items-start gap-3">
              <AlertTriangle className="text-warning flex-shrink-0 mt-1" size={24} />
              <div>
                <h5 className="fw-bold mb-1">Target Career Role Not Selected</h5>
                <p className="mb-3 small">
                  To calculate your skill gap match percentage, personalized roadmap, and project recommendations, please select a target career role.
                </p>
                <Link to="/profile" className="btn btn-warning btn-sm fw-semibold">
                  Choose Target Role in Profile &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="stat-card shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold">Acquired Skills</span>
                <div className="bg-primary-subtle text-primary p-2 rounded-2">
                  <Layers size={18} />
                </div>
              </div>
              <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>{mySkillsCount}</h3>
              <small className="text-muted">Skills in your profile</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold">Matched Skills</span>
                <div className="bg-success-subtle text-success p-2 rounded-2">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <h3 className="fw-bold text-success mb-0">{analysis?.matchedSkillsCount || 0}</h3>
              <small className="text-muted">Met for target role</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold">Missing Skills</span>
                <div className="bg-warning-subtle text-warning p-2 rounded-2">
                  <TrendingUp size={18} />
                </div>
              </div>
              <h3 className="fw-bold text-warning mb-0">{analysis?.missingSkillsCount || 0}</h3>
              <small className="text-muted">Skills to acquire</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="stat-card shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-semibold">AI Roadmaps</span>
                <div className="bg-info-subtle text-info p-2 rounded-2">
                  <Sparkles size={18} />
                </div>
              </div>
              <h3 className="fw-bold text-info mb-0">{roadmapsCount}</h3>
              <small className="text-muted">Generated plans</small>
            </div>
          </div>
        </div>

        {/* Center Match Score & AI Assessment Card */}
        {analysis && (
          <div className="card border p-4 p-lg-5 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="row align-items-center gy-4">
              <div className="col-md-4 text-center border-md-end">
                <div className={`match-score-circle ${matchClass} mb-3`}>
                  <span className="display-5 fw-extrabold">{analysis.overallMatchPercentage}%</span>
                  <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Match Score</span>
                </div>
                <span className={`badge bg-${analysis.readinessBadgeColor} px-3 py-1.5 rounded-pill fw-semibold`}>
                  {analysis.readinessStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="col-md-8 ps-md-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Sparkles className="text-primary" size={20} />
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>AI Readiness Summary</h5>
                </div>
                <p className="text-secondary mb-3 leading-relaxed">
                  {analysis.aiSummaryRecommendation}
                </p>

                {/* Missing Skills Pills */}
                {analysis.missingSkills?.length > 0 && (
                  <div className="mb-4">
                    <span className="text-muted small fw-semibold d-block mb-2 text-uppercase" style={{ fontSize: '0.75rem' }}>
                      Key Skills To Bridge First:
                    </span>
                    <div className="d-flex flex-wrap gap-1.5">
                      {analysis.missingSkills.slice(0, 6).map((s) => (
                        <span
                          key={s.skillId}
                          className={`badge ${s.priority === 'HIGH_PRIORITY' ? 'badge-required' : 'badge-preferred'} px-2.5 py-1.5 rounded-pill`}
                        >
                          {s.skillName} • {s.targetProficiency}
                        </span>
                      ))}
                      {analysis.missingSkills.length > 6 && (
                        <span className="badge border px-2 py-1.5 rounded-pill" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                          +{analysis.missingSkills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="d-flex flex-wrap gap-2">
                  <Link to="/analysis" className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 shadow-xs">
                    <Compass size={16} />
                    <span>View Gap Analysis</span>
                  </Link>
                  <Link to="/roadmap" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2">
                    <Sparkles size={16} />
                    <span>Generate AI Roadmap</span>
                  </Link>
                  <Link to="/resume-builder" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5 px-3 py-2">
                    <FileText size={16} />
                    <span>Build Resume</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Navigation 4-Grid */}
        <div className="row g-3">
          <div className="col-md-6 col-lg-3">
            <Link to="/skills" className="card p-4 text-decoration-none d-block h-100 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-primary-subtle text-primary p-2.5 rounded-3">
                  <Layers size={20} />
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Manage Skills</h6>
              <p className="text-muted extra-small mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                Add, update proficiency levels (Beginner, Intermediate, Advanced), or delete technical skills.
              </p>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/roadmap" className="card p-4 text-decoration-none d-block h-100 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-warning-subtle text-warning p-2.5 rounded-3">
                  <Sparkles size={20} />
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>AI Roadmap</h6>
              <p className="text-muted extra-small mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                Get a week-by-week curriculum calibrated to your missing skills with YouTube tutorials.
              </p>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/resume-builder" className="card p-4 text-decoration-none d-block h-100 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-success-subtle text-success p-2.5 rounded-3">
                  <FileText size={20} />
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Resume Builder</h6>
              <p className="text-muted extra-small mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                Create ATS-optimized resumes with 3 templates, live preview, auto-fill, and PDF download.
              </p>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/resume-analyzer" className="card p-4 text-decoration-none d-block h-100 border shadow-sm custom-card-hover" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="bg-info-subtle text-info p-2.5 rounded-3">
                  <ScanText size={20} />
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>ATS Resume Audit</h6>
              <p className="text-muted extra-small mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                Paste or upload your resume for keyword gap detection, section scores, and constructive feedback.
              </p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
