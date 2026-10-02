import React, { useState, useEffect } from 'react';
import { resumeAnalyzerApi, rolesApi, resumeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ScanText,
  Upload,
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FolderGit2,
  Award,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Check
} from 'lucide-react';

export const ResumeAnalyzerPage = () => {
  const { user } = useAuth();

  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');

  const [analyzing, setAnalyzing] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await rolesApi.getAllRoles();
      if (res.data && res.data.data) {
        setRoles(res.data.data);
        if (user?.targetRoleId) {
          setSelectedRoleId(user.targetRoleId);
        } else if (res.data.data.length > 0) {
          setSelectedRoleId(res.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch career roles', err);
      setError('Could not load career roles.');
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setResumeText(content);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please paste text directly.');
    };
    reader.readAsText(file);
  };

  const handleLoadFromBuilder = async () => {
    try {
      const res = await resumeApi.getResume();
      if (res.data && res.data.data) {
        const d = res.data.data;
        const textParts = [];
        if (d.fullName) textParts.push(`NAME: ${d.fullName}`);
        if (d.headline) textParts.push(`TITLE: ${d.headline}`);
        if (d.email) textParts.push(`EMAIL: ${d.email}`);
        if (d.phone) textParts.push(`PHONE: ${d.phone}`);
        if (d.linkedinUrl) textParts.push(`LINKEDIN: ${d.linkedinUrl}`);
        if (d.githubUrl) textParts.push(`GITHUB: ${d.githubUrl}`);
        if (d.summary) textParts.push(`SUMMARY:\n${d.summary}`);
        if (d.skills && d.skills.length > 0) textParts.push(`TECHNICAL SKILLS:\n${d.skills.join(', ')}`);
        if (d.projects && d.projects.length > 0) {
          textParts.push('PROJECTS:');
          d.projects.forEach((p) => {
            textParts.push(`- ${p.title} (${p.techStack}): ${p.description}`);
          });
        }
        if (d.experience && d.experience.length > 0) {
          textParts.push('EXPERIENCE:');
          d.experience.forEach((exp) => {
            textParts.push(`- ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`);
          });
        }
        if (d.education && d.education.length > 0) {
          textParts.push('EDUCATION:');
          d.education.forEach((edu) => {
            textParts.push(`- ${edu.degree} in ${edu.fieldOfStudy}, ${edu.institution} (${edu.startYear} - ${edu.endYear}) GPA: ${edu.gpa}`);
          });
        }
        setResumeText(textParts.join('\n\n'));
        setFileName('Saved Resume from SkillGap Builder');
      }
    } catch (err) {
      console.warn('Could not load builder resume', err);
      setError('Could not load saved resume. Please paste resume text.');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please paste or upload your resume text.');
      return;
    }
    if (!selectedRoleId) {
      setError('Please choose a target career role.');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');
      const res = await resumeAnalyzerApi.analyze({
        resumeText,
        jobRoleId: Number(selectedRoleId),
        fileName,
      });

      if (res.data) {
        setAnalysisResult(res.data);
      }
    } catch (err) {
      console.error('Analysis failed', err);
      setError(err.response?.data?.message || 'Resume analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container-fluid px-lg-4 py-4">
      {/* Header Banner */}
      <div className="card border mb-4 shadow-sm">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-info text-white p-2.5 rounded-3 d-inline-flex shadow-sm">
              <ScanText size={24} />
            </div>
            <div>
              <h4 className="fw-bolder mb-0" style={{ color: 'var(--text-primary)' }}>
                AI Resume & ATS Gap Analyzer
              </h4>
              <p className="text-muted small mb-0">
                Benchmark your resume against real industry roles, detect missing keywords, and get ATS critique
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5"
            onClick={handleLoadFromBuilder}
          >
            <FileText size={16} />
            <span>Load from My Resume Builder</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger small d-flex align-items-center gap-2 mb-4">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Input Section */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card border shadow-sm p-4">
            <form onSubmit={handleAnalyze}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">1. Select Target Career Role</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                      <Briefcase size={17} className="text-primary" />
                    </span>
                    <select
                      className="form-select"
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      required
                    >
                      <option value="">Select target role...</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">2. Upload Resume File (.txt or plain text document)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".txt,.md,.rtf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  {fileName && (
                    <span className="extra-small text-muted mt-1 d-block" style={{ fontSize: '0.8rem' }}>
                      Loaded: {fileName}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold mb-0">
                    3. Resume Text / Content (Paste your resume text below)
                  </label>
                  <span className="extra-small text-muted" style={{ fontSize: '0.8rem' }}>
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  className="form-control"
                  rows={8}
                  placeholder="Paste your complete resume text here (Summary, Skills, Projects, Experience, Education)..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2.5 d-inline-flex align-items-center gap-2 shadow-sm"
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Analyzing ATS Match & Skills...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Analyze My Resume</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results View */}
      {analysisResult && (
        <div className="row g-4">
          {/* Top Score Banner */}
          <div className="col-12">
            <div className="card border shadow-sm p-4">
              <div className="row align-items-center gy-4">
                <div className="col-lg-3 col-md-4 text-center">
                  <div
                    className={`match-score-circle ${
                      analysisResult.matchPercentage >= 75
                        ? 'match-high'
                        : analysisResult.matchPercentage >= 45
                        ? 'match-mid'
                        : 'match-low'
                    } mb-2`}
                  >
                    <span className="display-5 fw-bold">{analysisResult.matchPercentage}%</span>
                    <span className="extra-small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>ATS Match</span>
                  </div>
                  <span
                    className={`badge rounded-pill ${
                      analysisResult.matchPercentage >= 75
                        ? 'bg-success-subtle text-success'
                        : analysisResult.matchPercentage >= 45
                        ? 'bg-primary-subtle text-primary'
                        : 'bg-warning-subtle text-warning'
                    } border px-3 py-1.5`}
                  >
                    {analysisResult.matchVerdict}
                  </span>
                </div>

                <div className="col-lg-9 col-md-8">
                  <h4 className="fw-bolder mb-2" style={{ color: 'var(--text-primary)' }}>
                    Resume Diagnostic for: {analysisResult.targetRoleTitle}
                  </h4>
                  <p className="small mb-3" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {analysisResult.overallFeedback}
                  </p>

                  <div className="row g-2">
                    <div className="col-sm-4">
                      <div className="p-2.5 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <span className="d-block fw-bold fs-5 text-success">{analysisResult.matchedSkillsCount}</span>
                        <span className="small text-muted">Role Skills Matched</span>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="p-2.5 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <span className="d-block fw-bold fs-5 text-warning">{analysisResult.missingSkillsCount}</span>
                        <span className="small text-muted">Missing Role Skills</span>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="p-2.5 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <span className="d-block fw-bold fs-5 text-primary">{analysisResult.detectedSkills.length}</span>
                        <span className="small text-muted">Total Skills Detected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Critiques Grid */}
          <div className="col-lg-6">
            <div className="card border shadow-sm h-100">
              <div className="card-header border-bottom p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Award size={18} className="text-primary" />
                  <span>Resume Section Audit & Quality</span>
                </h5>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-3">
                  {analysisResult.sectionCritiques.map((critique, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-3 border"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold small" style={{ color: 'var(--text-primary)' }}>
                          {critique.sectionName}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <span className="small fw-bold">{critique.score}/100</span>
                          <span
                            className={`badge extra-small ${
                              critique.status === 'Strong'
                                ? 'bg-success-subtle text-success'
                                : critique.status === 'Average'
                                ? 'bg-warning-subtle text-warning'
                                : 'bg-danger-subtle text-danger'
                            } border`}
                            style={{ fontSize: '0.72rem' }}
                          >
                            {critique.status}
                          </span>
                        </div>
                      </div>
                      <p className="extra-small text-muted mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                        {critique.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="col-lg-6">
            <div className="card border shadow-sm h-100">
              <div className="card-header border-bottom p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Lightbulb size={18} className="text-warning" />
                  <span>Actionable Improvements</span>
                </h5>
              </div>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-2.5">
                  {analysisResult.improvementSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-3 border d-flex align-items-start gap-2.5"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}
                    >
                      <div className="p-1 rounded bg-warning-subtle text-warning flex-shrink-0 mt-0.5">
                        <Sparkles size={15} />
                      </div>
                      <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {sug}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills */}
          <div className="col-lg-6">
            <div className="card border shadow-sm">
              <div className="card-header border-bottom p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <h6 className="fw-bold mb-0 text-success d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Matched Skills ({analysisResult.matchedSkills.length})</span>
                </h6>
              </div>
              <div className="card-body p-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <div className="d-flex flex-wrap gap-2">
                  {analysisResult.matchedSkills.map((s) => (
                    <span
                      key={s.skillId}
                      className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 small"
                    >
                      ✓ {s.skillName}
                    </span>
                  ))}
                  {analysisResult.matchedSkills.length === 0 && (
                    <p className="text-muted small">No target role skills matched in this resume.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border shadow-sm">
              <div className="card-header border-bottom p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <h6 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2">
                  <AlertTriangle size={18} />
                  <span>Missing Skills for Role ({analysisResult.missingSkills.length})</span>
                </h6>
              </div>
              <div className="card-body p-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <div className="d-flex flex-wrap gap-2">
                  {analysisResult.missingSkills.map((s) => (
                    <span
                      key={s.skillId}
                      className={`badge ${
                        s.priority === 'HIGH_PRIORITY'
                          ? 'bg-danger-subtle text-danger border-danger-subtle'
                          : 'bg-warning-subtle text-warning border-warning-subtle'
                      } border px-2.5 py-1.5 small`}
                    >
                      {s.skillName} {s.priority === 'HIGH_PRIORITY' ? '(Required)' : ''}
                    </span>
                  ))}
                  {analysisResult.missingSkills.length === 0 && (
                    <p className="text-success small">Congratulations! No missing role skills detected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Projects to Address Missing Skills */}
          {analysisResult.recommendedProjects && analysisResult.recommendedProjects.length > 0 && (
            <div className="col-12">
              <div className="card border shadow-sm">
                <div className="card-header border-bottom p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FolderGit2 size={18} className="text-primary" />
                    <span>Recommended Projects to Bridge Missing Skills</span>
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {analysisResult.recommendedProjects.map((p) => (
                      <div key={p.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 border p-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle extra-small">
                              {p.difficulty}
                            </span>
                            <span className="extra-small text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                              <Clock size={12} /> {p.estimatedDuration}
                            </span>
                          </div>

                          <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{p.title}</h6>
                          <p className="extra-small text-muted mb-2 flex-grow-1" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                            {p.description}
                          </p>

                          <div className="mt-auto pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                            <span className="extra-small d-block text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                              <strong>Tech Stack: </strong>{p.techStack}
                            </span>
                            <div className="d-flex flex-wrap gap-1">
                              {p.addressedSkills && p.addressedSkills.map((sk, idx) => (
                                <span key={idx} className="badge bg-secondary-subtle text-secondary extra-small" style={{ fontSize: '0.7rem' }}>
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;
