import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analysisApi, rolesApi, resourcesApi } from '../services/api';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  FolderGit2,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Briefcase,
  PlayCircle,
  ExternalLink,
  Clock,
  BookOpen
} from 'lucide-react';

export const AnalysisPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [rolesRes, analysisRes, resourcesRes] = await Promise.allSettled([
          rolesApi.getAllRoles(),
          analysisApi.analyzeTargetRole(),
          resourcesApi.getAll(),
        ]);

        if (rolesRes.status === 'fulfilled' && rolesRes.value.data?.success) {
          setRoles(rolesRes.value.data.data);
        }

        if (analysisRes.status === 'fulfilled' && analysisRes.value.data?.success) {
          setAnalysis(analysisRes.value.data.data);
          setSelectedRoleId(analysisRes.value.data.data.jobRoleId);
        } else {
          setError('No target role selected or analysis unavailable. Please select a role from the dropdown below.');
        }

        if (resourcesRes.status === 'fulfilled' && resourcesRes.value.data?.success) {
          setResources(resourcesRes.value.data.data);
        }
      } catch (err) {
        console.warn('Initial target analysis failed', err);
        setError('No target role selected or analysis unavailable. Please select a role from the dropdown below.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleRoleChange = async (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);
    if (!roleId) return;

    setLoading(true);
    setError('');
    try {
      const res = await analysisApi.analyzeRole(roleId);
      if (res.data?.success) {
        setAnalysis(res.data.data);
      }
    } catch (err) {
      setError('Failed to compute analysis for selected role.');
    } finally {
      setLoading(false);
    }
  };

  const matchScore = analysis?.overallMatchPercentage || 0;
  const matchClass = matchScore >= 80 ? 'match-high' : matchScore >= 50 ? 'match-mid' : 'match-low';

  // Helper to find YouTube tutorial for a skill
  const getResourceForSkill = (skillName) => {
    if (!skillName) return null;
    const clean = skillName.trim().toLowerCase();
    return resources.find((r) => {
      const resName = r.skillName?.toLowerCase() || '';
      return resName === clean || resName.includes(clean) || clean.includes(resName);
    });
  };

  // Find all resources matching student's missing skills
  const missingSkillResources = (analysis?.missingSkills || [])
    .map((s) => ({ skill: s, resource: getResourceForSkill(s.skillName) }))
    .filter((item) => item.resource !== null && item.resource !== undefined);

  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        {/* Header & Role Switcher */}
        <div className="card border p-4 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="row align-items-center gy-3">
            <div className="col-md-7">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-2 fw-semibold px-2.5 py-1">
                Career Readiness Engine
              </span>
              <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Career Skill Gap Analysis</h2>
              <p className="text-muted small mb-0">
                Transparent benchmark comparing your acquired skills with target industry requirements.
              </p>
            </div>

            <div className="col-md-5">
              <label className="form-label small fw-semibold text-muted mb-1">Evaluate Against Career Role:</label>
              <div className="input-group">
                <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <Briefcase size={18} className="text-primary" />
                </span>
                <select
                  className="form-select border-start-0 fw-semibold"
                  value={selectedRoleId}
                  onChange={handleRoleChange}
                >
                  <option value="">-- Choose Career Role --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-warning border-0 rounded-4 p-4 mb-4 shadow-sm">
            <div className="d-flex align-items-start gap-3">
              <AlertTriangle className="text-warning flex-shrink-0 mt-1" size={24} />
              <div>
                <h5 className="fw-bold mb-1">Notice</h5>
                <p className="mb-0 small">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary my-4" role="status"></div>
            <p className="text-muted">Computing skill metrics and proficiency benchmarks...</p>
          </div>
        ) : analysis ? (
          <>
            {/* Top Analysis Score Card */}
            <div className="card border p-4 p-md-5 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="row align-items-center gy-4">
                <div className="col-md-4 text-center border-md-end">
                  <div className={`match-score-circle ${matchClass} mb-3`}>
                    <span className="display-4 fw-bold">{analysis.overallMatchPercentage}%</span>
                    <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Match Score</span>
                  </div>
                  <span className={`badge bg-${analysis.readinessBadgeColor} px-3 py-1.5 rounded-pill fw-semibold`}>
                    {analysis.readinessStatus.replace(/_/g, ' ')}
                  </span>
                  <div className="mt-3 text-muted small">
                    Target Role: <strong style={{ color: 'var(--text-primary)' }}>{analysis.jobRoleTitle}</strong>
                  </div>
                </div>

                <div className="col-md-8 ps-md-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Sparkles className="text-primary" size={20} />
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>AI Career Fit Assessment</h5>
                  </div>
                  <p className="text-secondary mb-3 leading-relaxed">
                    {analysis.aiSummaryRecommendation}
                  </p>

                  <div className="row g-2 mb-4 text-center">
                    <div className="col-4">
                      <div className="p-2.5 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <span className="small text-muted d-block">Total Role Skills</span>
                        <strong className="fs-5" style={{ color: 'var(--text-primary)' }}>{analysis.totalRoleSkills}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2.5 rounded-3 border border-success-subtle bg-success-subtle">
                        <span className="small text-success d-block">Matched Skills</span>
                        <strong className="fs-5 text-success">{analysis.matchedSkillsCount}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-2.5 rounded-3 border border-warning-subtle bg-warning-subtle">
                        <span className="small text-warning-emphasis d-block">Missing Skills</span>
                        <strong className="fs-5 text-warning-emphasis">{analysis.missingSkillsCount}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/roadmap" className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 shadow-sm">
                      <Sparkles size={16} />
                      <span>Generate Personalized AI Roadmap</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link to="/projects" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2">
                      <FolderGit2 size={16} />
                      <span>View Recommended Projects</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Skills 2-Column Section */}
            <div className="row g-4 mb-4">
              {/* Matched Skills */}
              <div className="col-lg-6">
                <div className="card border p-4 h-100 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-success-subtle text-success p-1.5 rounded-2">
                        <CheckCircle2 size={20} />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Matched Skills ({analysis.matchedSkills?.length || 0})</h5>
                    </div>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      Satisfied
                    </span>
                  </div>

                  {analysis.matchedSkills?.length === 0 ? (
                    <div className="text-center py-4 text-muted small">
                      No matching skills found for this role yet. Add relevant skills to your profile.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {analysis.matchedSkills.map((m) => (
                        <div key={m.skillId} className="p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <strong className="fs-6" style={{ color: 'var(--text-primary)' }}>{m.skillName}</strong>
                              <span className="badge bg-secondary-subtle text-secondary border ms-2 small">
                                {m.category?.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <span className={`badge ${m.importance === 'REQUIRED' ? 'badge-required' : 'badge-preferred'} small`}>
                              {m.importance}
                            </span>
                          </div>

                          <div className="row g-2 small text-muted mb-2">
                            <div className="col-6">
                              Your Level: <strong className="text-primary">{m.studentProficiency}</strong>
                            </div>
                            <div className="col-6 text-end">
                              Role Target: <strong style={{ color: 'var(--text-primary)' }}>{m.requiredProficiency}</strong>
                            </div>
                          </div>

                          <div className={`p-2 rounded-2 small ${m.proficiencyMet ? 'bg-success-subtle text-success-emphasis' : 'bg-warning-subtle text-warning-emphasis'}`}>
                            {m.gapNote}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Missing Skills with Attached Video Learning Resources */}
              <div className="col-lg-6">
                <div className="card border p-4 h-100 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-warning-subtle text-warning-emphasis p-1.5 rounded-2">
                        <TrendingUp size={20} />
                      </div>
                      <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Missing Skills ({analysis.missingSkills?.length || 0})</h5>
                    </div>
                    <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
                      Skills to Learn
                    </span>
                  </div>

                  {analysis.missingSkills?.length === 0 ? (
                    <div className="text-center py-4 text-success small">
                      🎉 Congratulations! You have no missing skills for this role!
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {analysis.missingSkills.map((s) => {
                        const videoTutorial = getResourceForSkill(s.skillName);
                        return (
                          <div key={s.skillId} className="p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <strong className="fs-6" style={{ color: 'var(--text-primary)' }}>{s.skillName}</strong>
                                <span className="badge bg-secondary-subtle text-secondary border ms-2 small">
                                  {s.category?.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <span className={`badge ${s.priority === 'HIGH_PRIORITY' ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-secondary-subtle text-secondary border'} small fw-bold`}>
                                {s.priority.replace(/_/g, ' ')}
                              </span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                              <span>Requirement: <strong style={{ color: 'var(--text-primary)' }}>{s.importance}</strong></span>
                              <span>Target: <strong className="text-primary">{s.targetProficiency}</strong></span>
                              <span>Weight: <strong>{s.weight} / 5</strong></span>
                            </div>

                            {/* Verified YouTube Resource Link if available */}
                            {videoTutorial && (
                              <div
                                className="mt-2 p-2 rounded-2 border d-flex align-items-center justify-content-between gap-2"
                                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
                              >
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                  <div className="text-danger flex-shrink-0">
                                    <PlayCircle size={20} />
                                  </div>
                                  <div className="overflow-hidden">
                                    <span className="d-block extra-small text-truncate fw-semibold" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                      {videoTutorial.title}
                                    </span>
                                    <span className="extra-small text-muted d-block" style={{ fontSize: '0.72rem' }}>
                                      {videoTutorial.channelName} • {videoTutorial.duration}
                                    </span>
                                  </div>
                                </div>

                                <a
                                  href={videoTutorial.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-danger py-0.5 px-2 flex-shrink-0 d-inline-flex align-items-center gap-1"
                                  style={{ fontSize: '0.75rem', height: '26px' }}
                                >
                                  <span>Watch</span>
                                  <ExternalLink size={11} />
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Curated YouTube Learning Resources for Missing Skills Section */}
            {missingSkillResources.length > 0 && (
              <div className="card border p-4 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-danger-subtle text-danger p-1.5 rounded-2">
                      <PlayCircle size={22} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                        Verified YouTube Video Tutorials for Your Missing Skills
                      </h5>
                      <span className="extra-small text-muted" style={{ fontSize: '0.8rem' }}>
                        High-quality free learning resources from verified educational creators
                      </span>
                    </div>
                  </div>
                  <span className="badge bg-danger text-white rounded-pill px-2.5 py-1">
                    {missingSkillResources.length} Tutorials
                  </span>
                </div>

                <div className="row g-3">
                  {missingSkillResources.map(({ skill, resource }, idx) => (
                    <div key={idx} className="col-md-6 col-lg-4">
                      <div className="card h-100 border p-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle extra-small">
                            {skill.skillName}
                          </span>
                          <span className="extra-small text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                            <Clock size={12} /> {resource.duration}
                          </span>
                        </div>

                        <h6 className="fw-bold mb-1 small" style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          {resource.title}
                        </h6>
                        <p className="extra-small text-muted mb-3 flex-grow-1" style={{ fontSize: '0.78rem' }}>
                          Channel: <strong className="text-secondary">{resource.channelName}</strong> • {resource.topic}
                        </p>

                        <a
                          href={resource.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-danger btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-1.5 rounded-pill shadow-xs"
                        >
                          <PlayCircle size={15} />
                          <span>Watch on YouTube</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AnalysisPage;
