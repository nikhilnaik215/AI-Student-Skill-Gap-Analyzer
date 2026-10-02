import React, { useState, useEffect } from 'react';
import { projectsApi } from '../services/api';
import {
  FolderGit2,
  Clock,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Code2,
  Filter
} from 'lucide-react';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await projectsApi.getRecommendedProjects();
        if (res.data?.success) {
          setProjects(res.data.data);
        }
      } catch (err) {
        setError('Failed to load recommended projects.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (difficultyFilter === 'ALL') return true;
    return p.difficulty === difficultyFilter;
  });

  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        {/* Header */}
        <div className="custom-card p-4 p-md-5 mb-4">
          <div className="row align-items-center gy-3">
            <div className="col-lg-8">
              <span className="badge bg-success-subtle text-success border border-success-subtle mb-2 px-3 py-1.5 rounded-pill fw-bold small text-uppercase d-inline-flex align-items-center gap-1">
                <FolderGit2 size={14} /> Practical Skill Building
              </span>
              <h2 className="fw-bold mb-2">Recommended Portfolio Projects</h2>
              <p className="text-muted mb-0" style={{ maxWidth: 650 }}>
                Practical, production-grade project blueprints filtered specifically to tackle the technologies you're currently missing for your target career role.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="d-inline-flex align-items-center gap-2 bg-light border p-1 rounded-pill">
                {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
                  <button
                    key={lvl}
                    className={`btn btn-sm ${difficultyFilter === lvl ? 'btn-primary' : 'btn-light'} rounded-pill px-3 py-1 small fw-semibold`}
                    onClick={() => setDifficultyFilter(lvl)}
                  >
                    {lvl === 'ALL' ? 'All' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger small mb-4">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary my-3" role="status"></div>
            <p className="text-muted">Filtering projects based on your missing skills...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="custom-card p-5 text-center text-muted">
            <FolderGit2 size={44} className="mb-2 text-muted opacity-50" />
            <h5 className="fw-bold mb-1">No Projects Found</h5>
            <p className="small">Try switching the difficulty filter above.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProjects.map((p) => (
              <div key={p.id} className="col-lg-6">
                <div className="custom-card custom-card-hover p-4 h-100 d-flex flex-direction-column justify-content-between">
                  <div>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <h5 className="fw-bold text-dark mb-0">{p.title}</h5>
                      <span className={`badge badge-${p.difficulty?.toLowerCase()} px-2.5 py-1 rounded-pill small`}>
                        {p.difficulty}
                      </span>
                    </div>

                    {/* Missing skills badge callout */}
                    {p.matchingMissingSkillsCount > 0 && (
                      <div className="mb-3">
                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-pill small d-inline-flex align-items-center gap-1">
                          <Sparkles size={13} /> Bridges {p.matchingMissingSkillsCount} of your missing skills!
                        </span>
                      </div>
                    )}

                    <p className="text-secondary small mb-3 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="mb-3">
                      <span className="text-muted extra-small text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.75rem' }}>
                        Tech Stack:
                      </span>
                      <div className="p-2 rounded-2 bg-light border small text-dark fw-semibold">
                        <Code2 size={14} className="text-primary me-1.5 d-inline" />
                        {p.techStack}
                      </div>
                    </div>

                    {/* Skills Addressed */}
                    {p.addressedSkills?.length > 0 && (
                      <div className="mb-3">
                        <span className="text-muted extra-small text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '0.75rem' }}>
                          Target Competencies:
                        </span>
                        <div className="d-flex flex-wrap gap-1.5">
                          {p.addressedSkills.map((s, idx) => (
                            <span key={idx} className="badge bg-light text-primary border px-2 py-1 rounded-pill small">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Outcomes */}
                    {p.learningOutcomes && (
                      <div className="p-2.5 rounded-2 bg-success-subtle border border-success-subtle small text-success-emphasis mb-3">
                        <strong>Outcome:</strong> {p.learningOutcomes}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center mt-3 small text-muted">
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={15} /> Est. Duration: <strong>{p.estimatedDuration || '2-3 Weeks'}</strong>
                    </span>
                    {p.targetRoleTitle && (
                      <span className="badge bg-light text-muted border">
                        {p.targetRoleTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
export default ProjectsPage;
