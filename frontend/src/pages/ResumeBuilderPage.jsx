import React, { useState, useEffect } from 'react';
import { resumeApi, profileApi, studentSkillsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Download,
  Save,
  Wand2,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Layout,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink,
  Code2
} from 'lucide-react';

const DEFAULT_RESUME_DATA = {
  templateName: 'modern',
  fullName: '',
  email: '',
  phone: '',
  location: '',
  headline: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  summary: '',
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  skills: [],
  sectionOrder: ['summary', 'skills', 'projects', 'experience', 'education', 'certifications'],
};

export const ResumeBuilderPage = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setLoading(true);
      const res = await resumeApi.getResume();
      if (res.data && res.data.data) {
        const d = res.data.data;
        setResumeData({
          templateName: d.templateName || 'modern',
          fullName: d.fullName || user?.fullName || '',
          email: d.email || user?.email || '',
          phone: d.phone || '',
          location: d.location || '',
          headline: d.headline || (user?.targetRoleTitle ? `Aspiring ${user.targetRoleTitle}` : ''),
          linkedinUrl: d.linkedinUrl || '',
          githubUrl: d.githubUrl || '',
          portfolioUrl: d.portfolioUrl || '',
          summary: d.summary || '',
          education: d.education || [],
          experience: d.experience || [],
          projects: d.projects || [],
          certifications: d.certifications || [],
          skills: d.skills || [],
          sectionOrder: d.sectionOrder || DEFAULT_RESUME_DATA.sectionOrder,
        });
      }
    } catch (err) {
      console.warn('Could not load existing resume, initializing empty', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPopulate = async () => {
    try {
      setAutoFilling(true);
      setSaveMessage({ type: '', text: '' });
      const res = await resumeApi.autoPopulate();
      if (res.data && res.data.data) {
        const d = res.data.data;
        setResumeData((prev) => ({
          ...prev,
          fullName: d.fullName || prev.fullName,
          email: d.email || prev.email,
          phone: d.phone || prev.phone,
          linkedinUrl: d.linkedinUrl || prev.linkedinUrl,
          githubUrl: d.githubUrl || prev.githubUrl,
          summary: d.summary || prev.summary,
          headline: d.headline || prev.headline,
          education: d.education && d.education.length > 0 ? d.education : prev.education,
          skills: d.skills && d.skills.length > 0 ? d.skills : prev.skills,
        }));
        setSaveMessage({ type: 'success', text: 'Auto-populated from your Profile & Skills catalog!' });
      }
    } catch (err) {
      console.error('Auto populate failed', err);
      setSaveMessage({ type: 'danger', text: 'Failed to auto-populate from profile.' });
    } finally {
      setAutoFilling(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage({ type: '', text: '' });
      await resumeApi.saveResume(resumeData);
      setSaveMessage({ type: 'success', text: 'Resume saved to cloud successfully!' });
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error('Save failed', err);
      setSaveMessage({ type: 'danger', text: 'Failed to save resume. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Section Ordering Helpers
  const moveSection = (index, direction) => {
    const newOrder = [...resumeData.sectionOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setResumeData({ ...resumeData, sectionOrder: newOrder });
  };

  // Education Helpers
  const addEducation = () => {
    const newItem = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '2021',
      endYear: '2025',
      gpa: '',
    };
    setResumeData({ ...resumeData, education: [...resumeData.education, newItem] });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resumeData.education];
    updated[index][field] = value;
    setResumeData({ ...resumeData, education: updated });
  };

  const removeEducation = (index) => {
    setResumeData({ ...resumeData, education: resumeData.education.filter((_, i) => i !== index) });
  };

  // Projects Helpers
  const addProject = () => {
    const newItem = {
      title: '',
      techStack: '',
      description: '',
      githubUrl: '',
      liveUrl: '',
    };
    setResumeData({ ...resumeData, projects: [...resumeData.projects, newItem] });
  };

  const updateProject = (index, field, value) => {
    const updated = [...resumeData.projects];
    updated[index][field] = value;
    setResumeData({ ...resumeData, projects: updated });
  };

  const removeProject = (index) => {
    setResumeData({ ...resumeData, projects: resumeData.projects.filter((_, i) => i !== index) });
  };

  // Experience Helpers
  const addExperience = () => {
    const newItem = {
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      description: '',
    };
    setResumeData({ ...resumeData, experience: [...resumeData.experience, newItem] });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resumeData.experience];
    updated[index][field] = value;
    setResumeData({ ...resumeData, experience: updated });
  };

  const removeExperience = (index) => {
    setResumeData({ ...resumeData, experience: resumeData.experience.filter((_, i) => i !== index) });
  };

  // Certifications Helpers
  const addCertification = () => {
    const newItem = {
      title: '',
      issuer: '',
      issueDate: '',
      url: '',
    };
    setResumeData({ ...resumeData, certifications: [...resumeData.certifications, newItem] });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...resumeData.certifications];
    updated[index][field] = value;
    setResumeData({ ...resumeData, certifications: updated });
  };

  const removeCertification = (index) => {
    setResumeData({ ...resumeData, certifications: resumeData.certifications.filter((_, i) => i !== index) });
  };

  // Skills Tag String helper
  const skillsText = Array.isArray(resumeData.skills)
    ? resumeData.skills.join(', ')
    : '';

  const handleSkillsTextChange = (text) => {
    const list = text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setResumeData({ ...resumeData, skills: list });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted small mt-2">Loading Resume Builder...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-lg-4 py-4">
      {/* Top Action Bar */}
      <div className="card border mb-4 shadow-sm no-print">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-2.5 rounded-3 d-inline-flex shadow-sm">
              <FileText size={22} />
            </div>
            <div>
              <h4 className="fw-bolder mb-0" style={{ color: 'var(--text-primary)' }}>
                Professional Resume Builder
              </h4>
              <p className="text-muted small mb-0">
                Design ATS-optimized, high-impact resumes with live preview and PDF export
              </p>
            </div>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
              onClick={handleAutoPopulate}
              disabled={autoFilling}
              title="Pre-fill details from your student profile and skills"
            >
              <Wand2 size={16} className="text-warning" />
              <span>{autoFilling ? 'Auto-filling...' : 'Auto-fill from Profile'}</span>
            </button>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Resume'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 shadow-sm"
              onClick={handlePrint}
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {saveMessage.text && (
        <div className={`alert alert-${saveMessage.type} small d-flex align-items-center gap-2 mb-3 no-print`}>
          {saveMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {saveMessage.text}
        </div>
      )}

      {/* Main Grid: Left Editor & Right Live Preview */}
      <div className="row g-4">
        {/* ========================================================= */}
        {/* LEFT COLUMN: RESUME EDITOR (Hidden when printing)         */}
        {/* ========================================================= */}
        <div className="col-xl-5 col-lg-6 no-print">
          <div className="card border shadow-sm">
            {/* Template Selector & Editor Tabs */}
            <div className="card-header border-bottom p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold small text-uppercase" style={{ color: 'var(--text-secondary)' }}>
                  Template Style
                </span>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    className={`btn ${resumeData.templateName === 'modern' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setResumeData({ ...resumeData, templateName: 'modern' })}
                  >
                    Modern SaaS
                  </button>
                  <button
                    type="button"
                    className={`btn ${resumeData.templateName === 'executive' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setResumeData({ ...resumeData, templateName: 'executive' })}
                  >
                    Executive Classic
                  </button>
                  <button
                    type="button"
                    className={`btn ${resumeData.templateName === 'minimalist' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setResumeData({ ...resumeData, templateName: 'minimalist' })}
                  >
                    Tech Minimalist
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <ul className="nav nav-pills nav-fill gap-1 pt-2">
                {[
                  { id: 'personal', label: 'Contact', icon: FileText },
                  { id: 'skills', label: 'Skills', icon: Code2 },
                  { id: 'projects', label: 'Projects', icon: FolderGit2 },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'reorder', label: 'Layout', icon: Layout },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <li key={t.id} className="nav-item">
                      <button
                        type="button"
                        className={`nav-link py-1.5 px-2 small d-flex align-items-center justify-content-center gap-1 ${
                          activeTab === t.id ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab(t.id)}
                      >
                        <Icon size={14} />
                        <span>{t.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Tab Contents */}
            <div className="card-body p-4" style={{ maxHeight: '720px', overflowY: 'auto' }}>
              {/* TAB 1: Personal Info & Summary */}
              {activeTab === 'personal' && (
                <div className="d-flex flex-column gap-3">
                  <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Personal & Contact Details</h6>
                  <div className="row g-2">
                    <div className="col-sm-6">
                      <label className="form-label small">Full Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={resumeData.fullName}
                        onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                        placeholder="Nihar Sharma"
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small">Professional Headline</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={resumeData.headline}
                        onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
                        placeholder="Aspiring Java Full Stack Developer"
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-sm-6">
                      <label className="form-label small">Email Address *</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        value={resumeData.email}
                        onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                        placeholder="student@skillgap.com"
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small">Phone Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={resumeData.phone}
                        onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-sm-6">
                      <label className="form-label small">Location / City</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={resumeData.location}
                        onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                        placeholder="Bangalore, India"
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small">GitHub URL</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={resumeData.githubUrl}
                        onChange={(e) => setResumeData({ ...resumeData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-sm-6">
                      <label className="form-label small">LinkedIn URL</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={resumeData.linkedinUrl}
                        onChange={(e) => setResumeData({ ...resumeData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small">Portfolio / Website</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        value={resumeData.portfolioUrl}
                        onChange={(e) => setResumeData({ ...resumeData, portfolioUrl: e.target.value })}
                        placeholder="https://myportfolio.dev"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="form-label small fw-bold">Professional Summary / Objective</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      placeholder="Goal-oriented B.Tech Computer Science student with strong foundations in Java 21, Spring Boot, MySQL, and React.js. Passionate about engineering high-throughput microservices and scalable cloud-ready architectures..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Skills */}
              {activeTab === 'skills' && (
                <div>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Technical Skills</h6>
                  <p className="text-muted small">
                    Enter your skills separated by commas. These will render as formatted keywords in your resume.
                  </p>
                  <textarea
                    className="form-control"
                    rows={6}
                    value={skillsText}
                    onChange={(e) => handleSkillsTextChange(e.target.value)}
                    placeholder="Java, Spring Boot, React.js, MySQL, RESTful APIs, Git, Docker, Python, Data Structures..."
                  />

                  <div className="mt-3">
                    <span className="small fw-semibold d-block mb-2 text-muted">Preview Tag Chips:</span>
                    <div className="d-flex flex-wrap gap-1.5">
                      {resumeData.skills.map((s, idx) => (
                        <span key={idx} className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Projects */}
              {activeTab === 'projects' && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Technical Projects</h6>
                    <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={addProject}>
                      <Plus size={14} /> Add Project
                    </button>
                  </div>

                  {resumeData.projects.length === 0 ? (
                    <p className="text-muted small text-center py-3">No projects added. Click "Add Project" to include your best work.</p>
                  ) : (
                    resumeData.projects.map((proj, idx) => (
                      <div key={idx} className="p-3 mb-3 border rounded-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold small">Project #{idx + 1}</span>
                          <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeProject(idx)}>
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="row g-2 mb-2">
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Project Title (e.g. AI Skill Gap Analyzer)"
                              value={proj.title}
                              onChange={(e) => updateProject(idx, 'title', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Tech Stack (e.g. Java, Spring Boot, MySQL, React)"
                              value={proj.techStack}
                              onChange={(e) => updateProject(idx, 'techStack', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="row g-2 mb-2">
                          <div className="col-sm-6">
                            <input
                              type="url"
                              className="form-control form-control-sm"
                              placeholder="GitHub Link (optional)"
                              value={proj.githubUrl}
                              onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="url"
                              className="form-control form-control-sm"
                              placeholder="Live Demo URL (optional)"
                              value={proj.liveUrl}
                              onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)}
                            />
                          </div>
                        </div>

                        <textarea
                          className="form-control form-control-sm"
                          rows={3}
                          placeholder="Bullet points / Key achievements (e.g. Engineered full-stack platform serving 500+ student queries with 99.9% uptime...)"
                          value={proj.description}
                          onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: Experience */}
              {activeTab === 'experience' && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Work & Internship Experience</h6>
                    <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={addExperience}>
                      <Plus size={14} /> Add Experience
                    </button>
                  </div>

                  {resumeData.experience.length === 0 ? (
                    <p className="text-muted small text-center py-3">No work experience listed. Add internships or freelance work.</p>
                  ) : (
                    resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="p-3 mb-3 border rounded-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold small">Experience #{idx + 1}</span>
                          <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeExperience(idx)}>
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="row g-2 mb-2">
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Role / Title (e.g. Software Engineer Intern)"
                              value={exp.role}
                              onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Company Name (e.g. TechCorp Solutions)"
                              value={exp.company}
                              onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="row g-2 mb-2">
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Location (e.g. Remote / Bangalore)"
                              value={exp.location}
                              onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Start Date (e.g. Jun 2024)"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="End Date (e.g. Aug 2024)"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>

                        <textarea
                          className="form-control form-control-sm"
                          rows={3}
                          placeholder="Responsibilities and quantifiable accomplishments..."
                          value={exp.description}
                          onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: Education */}
              {activeTab === 'education' && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Education Details</h6>
                    <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={addEducation}>
                      <Plus size={14} /> Add Education
                    </button>
                  </div>

                  {resumeData.education.length === 0 ? (
                    <p className="text-muted small text-center py-3">No education records added. Click "Add Education".</p>
                  ) : (
                    resumeData.education.map((edu, idx) => (
                      <div key={idx} className="p-3 mb-3 border rounded-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-semibold small">Education #{idx + 1}</span>
                          <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeEducation(idx)}>
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="mb-2">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="College / University Name"
                            value={edu.institution}
                            onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          />
                        </div>

                        <div className="row g-2 mb-2">
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Degree (e.g. B.Tech)"
                              value={edu.degree}
                              onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Branch (e.g. Computer Science)"
                              value={edu.fieldOfStudy}
                              onChange={(e) => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="row g-2">
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Start Year (2021)"
                              value={edu.startYear}
                              onChange={(e) => updateEducation(idx, 'startYear', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="End Year (2025)"
                              value={edu.endYear}
                              onChange={(e) => updateEducation(idx, 'endYear', e.target.value)}
                            />
                          </div>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="CGPA / % (e.g. 8.6 / 10)"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 6: Reorder Sections */}
              {activeTab === 'reorder' && (
                <div>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Rearrange Resume Sections</h6>
                  <p className="text-muted small">
                    Adjust the sequence in which your resume sections will render on the final document.
                  </p>

                  <div className="d-flex flex-column gap-2">
                    {resumeData.sectionOrder.map((sectionKey, index) => {
                      const labels = {
                        summary: 'Professional Summary',
                        skills: 'Technical Skills',
                        projects: 'Technical Projects',
                        experience: 'Work & Internships',
                        education: 'Education',
                        certifications: 'Certifications',
                      };

                      return (
                        <div
                          key={sectionKey}
                          className="p-2.5 rounded-3 border d-flex align-items-center justify-content-between"
                          style={{ backgroundColor: 'var(--bg-subtle)' }}
                        >
                          <span className="fw-semibold small">{labels[sectionKey] || sectionKey}</span>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-light border p-1"
                              disabled={index === 0}
                              onClick={() => moveSection(index, -1)}
                              title="Move Up"
                            >
                              <MoveUp size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-light border p-1"
                              disabled={index === resumeData.sectionOrder.length - 1}
                              onClick={() => moveSection(index, 1)}
                              title="Move Down"
                            >
                              <MoveDown size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LIVE RESUME PREVIEW (Printed directly)      */}
        {/* ========================================================= */}
        <div className="col-xl-7 col-lg-6 resume-print-area">
          <div className={`resume-preview-sheet template-${resumeData.templateName}`}>
            {/* Header / Contact Area */}
            <div className="resume-header">
              <h1 className="resume-name mb-1">{resumeData.fullName || 'YOUR NAME'}</h1>
              {resumeData.headline && (
                <div className="fw-semibold fs-6 mb-2" style={{ color: '#4b5563' }}>
                  {resumeData.headline}
                </div>
              )}

              <div className="d-flex flex-wrap align-items-center gap-2 small text-muted">
                {resumeData.email && <span>{resumeData.email}</span>}
                {resumeData.phone && (
                  <>
                    <span>•</span>
                    <span>{resumeData.phone}</span>
                  </>
                )}
                {resumeData.location && (
                  <>
                    <span>•</span>
                    <span>{resumeData.location}</span>
                  </>
                )}
                {resumeData.githubUrl && (
                  <>
                    <span>•</span>
                    <span>{resumeData.githubUrl.replace(/^https?:\/\//, '')}</span>
                  </>
                )}
                {resumeData.linkedinUrl && (
                  <>
                    <span>•</span>
                    <span>{resumeData.linkedinUrl.replace(/^https?:\/\//, '')}</span>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Section Rendering in Student's Custom Order */}
            {resumeData.sectionOrder.map((sectionKey) => {
              // 1. Summary
              if (sectionKey === 'summary' && resumeData.summary) {
                return (
                  <div key="summary" className="resume-section mb-3">
                    <h2 className="resume-section-title">Professional Summary</h2>
                    <p className="small mb-0" style={{ color: '#374151', lineHeight: '1.6' }}>
                      {resumeData.summary}
                    </p>
                  </div>
                );
              }

              // 2. Skills
              if (sectionKey === 'skills' && resumeData.skills.length > 0) {
                return (
                  <div key="skills" className="resume-section mb-3">
                    <h2 className="resume-section-title">Technical Skills</h2>
                    <p className="small mb-0" style={{ color: '#374151' }}>
                      <strong>Technologies & Core Tools: </strong>
                      {resumeData.skills.join(' • ')}
                    </p>
                  </div>
                );
              }

              // 3. Projects
              if (sectionKey === 'projects' && resumeData.projects.length > 0) {
                return (
                  <div key="projects" className="resume-section mb-3">
                    <h2 className="resume-section-title">Technical Projects</h2>
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx} className="mb-2.5">
                        <div className="d-flex justify-content-between align-items-baseline">
                          <strong className="small" style={{ color: '#111827' }}>{proj.title}</strong>
                          {proj.techStack && (
                            <span className="extra-small fst-italic text-muted" style={{ fontSize: '0.8rem' }}>
                              [{proj.techStack}]
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="small mb-0 text-muted" style={{ lineHeight: '1.5' }}>
                            {proj.description}
                          </p>
                        )}
                        {(proj.githubUrl || proj.liveUrl) && (
                          <div className="extra-small text-muted" style={{ fontSize: '0.78rem' }}>
                            {proj.githubUrl && <span>Code: {proj.githubUrl.replace(/^https?:\/\//, '')} </span>}
                            {proj.liveUrl && <span>| Live: {proj.liveUrl.replace(/^https?:\/\//, '')}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              // 4. Experience
              if (sectionKey === 'experience' && resumeData.experience.length > 0) {
                return (
                  <div key="experience" className="resume-section mb-3">
                    <h2 className="resume-section-title">Experience & Internships</h2>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-2.5">
                        <div className="d-flex justify-content-between align-items-baseline">
                          <div>
                            <strong className="small" style={{ color: '#111827' }}>{exp.role}</strong>
                            <span className="small text-muted"> — {exp.company}</span>
                          </div>
                          <span className="extra-small text-muted" style={{ fontSize: '0.8rem' }}>
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="small mb-0 text-muted" style={{ lineHeight: '1.5' }}>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              // 5. Education
              if (sectionKey === 'education' && resumeData.education.length > 0) {
                return (
                  <div key="education" className="resume-section mb-3">
                    <h2 className="resume-section-title">Education</h2>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="d-flex justify-content-between align-items-baseline">
                          <strong className="small" style={{ color: '#111827' }}>{edu.institution}</strong>
                          <span className="extra-small text-muted" style={{ fontSize: '0.8rem' }}>
                            {edu.startYear} – {edu.endYear}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between small text-muted">
                          <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                          {edu.gpa && <span>CGPA/Score: {edu.gpa}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
