import React, { useState, useEffect } from 'react';
import { roadmapApi, resourcesApi } from '../services/api';
import {
  Sparkles,
  Calendar,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Code,
  Layers,
  Clock,
  ArrowRight,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

export const RoadmapPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [learningResources, setLearningResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [roadmapsRes, resourcesRes] = await Promise.allSettled([
        roadmapApi.getMyRoadmaps(),
        resourcesApi.getAll(),
      ]);

      if (roadmapsRes.status === 'fulfilled' && roadmapsRes.value.data?.success && roadmapsRes.value.data.data.length > 0) {
        setRoadmaps(roadmapsRes.value.data.data);
        setActiveRoadmap(roadmapsRes.value.data.data[0]);
      }

      if (resourcesRes.status === 'fulfilled' && resourcesRes.value.data?.success) {
        setLearningResources(resourcesRes.value.data.data);
      }
    } catch (err) {
      console.warn('Could not load saved roadmaps or resources', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    setError('');
    setSuccess('');
    try {
      const res = await roadmapApi.generateRoadmap();
      if (res.data?.success) {
        const newRoadmap = res.data.data;
        setActiveRoadmap(newRoadmap);
        setRoadmaps((prev) => [newRoadmap, ...prev]);
        setSuccess('AI Learning Roadmap successfully generated and tailored to your missing skills!');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate roadmap. Please select a target role in your profile first.');
    } finally {
      setGenerating(false);
    }
  };

  const getYouTubeResourceForModule = (focusSkill, title) => {
    if (!focusSkill && !title) return null;
    const s1 = (focusSkill || '').toLowerCase();
    const s2 = (title || '').toLowerCase();

    return learningResources.find((r) => {
      const name = r.skillName?.toLowerCase() || '';
      return s1.includes(name) || name.includes(s1) || s2.includes(name);
    });
  };

  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        {/* Top Header */}
        <div className="card border p-4 p-md-5 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="row align-items-center gy-3">
            <div className="col-lg-8">
              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle mb-2 px-3 py-1.5 rounded-pill fw-bold small text-uppercase d-inline-flex align-items-center gap-1">
                <Sparkles size={14} /> AI-Generated Career Curriculum
              </span>
              <h2 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Personalized AI Learning Roadmap</h2>
              <p className="text-muted mb-0" style={{ maxWidth: 680 }}>
                Our AI analyzes your skill gap against your chosen career role and creates a week-by-week curriculum complete with focused topics, measurable objectives, practical assignments, and verified free YouTube video courses.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <button
                className="btn btn-primary px-4 py-2.5 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold"
                onClick={handleGenerateRoadmap}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>AI Generating Roadmap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate AI Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
            <CheckCircle size={18} /> {success}
          </div>
        )}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading your roadmaps...</p>
          </div>
        ) : activeRoadmap ? (
          <div className="row g-4">
            {/* History Selector */}
            {roadmaps.length > 1 && (
              <div className="col-12">
                <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2">
                  <span className="small text-muted fw-semibold me-1">Saved Versions:</span>
                  {roadmaps.map((r, i) => (
                    <button
                      key={r.id || i}
                      className={`btn btn-sm rounded-pill px-3 ${
                        activeRoadmap.id === r.id ? 'btn-primary' : 'btn-outline-secondary'
                      }`}
                      onClick={() => setActiveRoadmap(r)}
                    >
                      Plan #{roadmaps.length - i} ({r.createdAt || 'Recent'})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Roadmap Overview */}
            <div className="col-12">
              <div className="card border p-4 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{activeRoadmap.title}</h4>
                    <p className="text-muted small mb-0">{activeRoadmap.summary}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <span className="badge border px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 small fw-semibold" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                      <Clock size={14} className="text-primary" />
                      {activeRoadmap.durationWeeks} Weeks Total
                    </span>
                    {activeRoadmap.createdAt && (
                      <span className="badge border px-3 py-2 rounded-pill d-flex align-items-center gap-1.5 small text-muted" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <Calendar size={14} />
                        {activeRoadmap.createdAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="timeline-container">
                {activeRoadmap.modules?.map((mod, idx) => {
                  const ytTutorial = getYouTubeResourceForModule(mod.focusSkill, mod.title);

                  return (
                    <div key={idx} className="timeline-step">
                      <div className="card border p-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        {/* Week Header */}
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                          <div>
                            <span className="badge bg-primary px-2.5 py-1 rounded-pill small fw-bold mb-1">
                              Week {mod.week}
                            </span>
                            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>{mod.title}</h5>
                          </div>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 rounded-pill small fw-semibold">
                            Focus: {mod.focusSkill}
                          </span>
                        </div>

                        {/* Learning Objectives */}
                        {mod.learningObjectives?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-muted extra-small text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '0.75rem' }}>
                              Learning Objectives:
                            </span>
                            <div className="d-flex flex-column gap-1">
                              {mod.learningObjectives.map((obj, i) => (
                                <div key={i} className="d-flex align-items-start gap-2 small" style={{ color: 'var(--text-secondary)' }}>
                                  <CheckCircle size={15} className="text-success flex-shrink-0 mt-0.5" />
                                  <span>{obj}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Topics Covered */}
                        {mod.keyTopics?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-muted extra-small text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '0.75rem' }}>
                              Key Topics:
                            </span>
                            <div className="d-flex flex-wrap gap-1.5">
                              {mod.keyTopics.map((topic, i) => (
                                <span key={i} className="badge border px-2.5 py-1 rounded-pill small" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Hands-on Practice */}
                        {mod.suggestedPractice && (
                          <div className="p-3 rounded-3 border mb-3" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                            <div className="d-flex align-items-center gap-2 mb-1 text-primary small fw-bold">
                              <Code size={16} />
                              <span>Recommended Hands-on Practice:</span>
                            </div>
                            <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>{mod.suggestedPractice}</p>
                          </div>
                        )}

                        {/* Verified YouTube Resource Card */}
                        {ytTutorial && (
                          <div
                            className="p-3 rounded-3 border mb-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.25)' }}
                          >
                            <div className="d-flex align-items-center gap-2.5">
                              <div className="p-2 bg-danger text-white rounded-3 flex-shrink-0 shadow-xs">
                                <PlayCircle size={22} />
                              </div>
                              <div>
                                <span className="extra-small text-uppercase fw-bold text-danger d-block" style={{ fontSize: '0.7rem' }}>
                                  Verified Video Tutorial
                                </span>
                                <strong className="small d-block" style={{ color: 'var(--text-primary)' }}>
                                  {ytTutorial.title}
                                </strong>
                                <span className="extra-small text-muted" style={{ fontSize: '0.75rem' }}>
                                  {ytTutorial.channelName} • {ytTutorial.duration} • {ytTutorial.difficulty}
                                </span>
                              </div>
                            </div>

                            <a
                              href={ytTutorial.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-danger d-inline-flex align-items-center gap-1.5 rounded-pill px-3 shadow-xs flex-shrink-0"
                            >
                              <span>Watch on YouTube</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        )}

                        {/* Curated Free Resources */}
                        {mod.recommendedResources?.length > 0 && (
                          <div>
                            <span className="text-muted extra-small text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '0.75rem' }}>
                              Curated Documentation & Reading:
                            </span>
                            <div className="d-flex flex-wrap gap-2">
                              {mod.recommendedResources.map((res, i) => (
                                <div key={i} className="badge border px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1 small" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                                  <BookOpen size={13} className="text-primary" />
                                  <span>{res}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="card border p-5 text-center shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <Sparkles size={48} className="text-primary mx-auto mb-3" />
            <h4 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Roadmap Generated Yet</h4>
            <p className="text-muted small mb-4" style={{ maxWidth: 500, margin: '0 auto' }}>
              Click the button above to have our AI analyze your missing skills and compile an industry-standard, week-by-week curriculum.
            </p>
            <div>
              <button
                className="btn btn-primary px-4 py-2.5 shadow-sm d-inline-flex align-items-center gap-2"
                onClick={handleGenerateRoadmap}
                disabled={generating}
              >
                <Sparkles size={18} />
                <span>Generate My First AI Roadmap</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
