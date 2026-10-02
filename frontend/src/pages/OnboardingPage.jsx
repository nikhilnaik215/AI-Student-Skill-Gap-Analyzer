import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogSkillsApi, studentSkillsApi, profileApi, analysisApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Search,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Compass,
  AlertCircle
} from 'lucide-react';

const POPULAR_SKILLS = [
  'Java', 'Python', 'SQL', 'HTML5', 'CSS3', 'JavaScript',
  'React.js', 'C', 'C++', 'Data Structures & Algorithms',
  'Microsoft Excel', 'Machine Learning'
];

export const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [catalogSkills, setCatalogSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // selectedSkills: Map or Array of { skillId, name, proficiency, yearsOfExperience, isCustom }
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Custom skill input
  const [customSkillName, setCustomSkillName] = useState('');
  const [customProficiency, setCustomProficiency] = useState('BEGINNER');

  // Match result modal state
  const [matchResult, setMatchResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await catalogSkillsApi.getSkills();
      if (res.data && res.data.data) {
        setCatalogSkills(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load skills catalog', err);
      setError('Failed to load skills catalog. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSkill = (skill) => {
    const exists = selectedSkills.find((s) => s.skillId === skill.id || s.name.toLowerCase() === skill.name.toLowerCase());
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s !== exists));
    } else {
      setSelectedSkills([
        ...selectedSkills,
        {
          skillId: skill.id,
          name: skill.name,
          category: skill.category,
          proficiency: 'BEGINNER',
          yearsOfExperience: 1,
          isCustom: false,
        },
      ]);
    }
  };

  const handleProficiencyChange = (skillName, newProficiency) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.name === skillName ? { ...s, proficiency: newProficiency } : s))
    );
  };

  const handleRemoveSkill = (skillName) => {
    setSelectedSkills(selectedSkills.filter((s) => s.name !== skillName));
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = customSkillName.trim();
    if (!trimmed) return;

    if (selectedSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError(`Skill "${trimmed}" is already added.`);
      return;
    }

    // Check if it's in catalog
    const inCatalog = catalogSkills.find((s) => s.name.toLowerCase() === trimmed.toLowerCase());
    if (inCatalog) {
      setSelectedSkills([
        ...selectedSkills,
        {
          skillId: inCatalog.id,
          name: inCatalog.name,
          category: inCatalog.category,
          proficiency: customProficiency,
          yearsOfExperience: 1,
          isCustom: false,
        },
      ]);
    } else {
      setSelectedSkills([
        ...selectedSkills,
        {
          skillId: null,
          name: trimmed,
          category: 'PROGRAMMING',
          proficiency: customProficiency,
          yearsOfExperience: 1,
          isCustom: true,
        },
      ]);
    }

    setCustomSkillName('');
    setError('');
  };

  const categories = ['ALL', 'PROGRAMMING', 'WEB_DEVELOPMENT', 'DATABASE', 'FRAMEWORK', 'AI_DATA_SCIENCE', 'CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'];

  const filteredSkills = catalogSkills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isSkillSelected = (skillName) => {
    return selectedSkills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
  };

  const handleFinishOnboarding = async () => {
    try {
      setSubmitting(true);
      setError('');

      if (selectedSkills.length > 0) {
        // Bulk save through backend REST API
        const payload = selectedSkills.map((s) => ({
          skillId: s.skillId,
          customSkillName: s.isCustom ? s.name : null,
          customSkillCategory: s.isCustom ? 'PROGRAMMING' : null,
          proficiency: s.proficiency,
          yearsOfExperience: s.yearsOfExperience || 1,
        }));
        await studentSkillsApi.addSkillsBulk(payload);
      }

      // Mark onboarding completed in database
      await profileApi.completeOnboarding();

      // Fetch initial skill match
      try {
        const analysisRes = await analysisApi.analyzeTargetRole();
        if (analysisRes.data && analysisRes.data.data) {
          setMatchResult(analysisRes.data.data);
          setShowResultModal(true);
          return;
        }
      } catch (err) {
        // If analysis fails (e.g. no target role set yet), just navigate
        console.warn('Initial analysis could not be calculated', err);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error completing onboarding', err);
      setError(err.response?.data?.message || 'Failed to save skills. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      await profileApi.completeOnboarding();
    } catch (e) {
      // Ignore
    }
    navigate('/dashboard');
  };

  return (
    <div className="py-5" style={{ minHeight: '85vh' }}>
      <div className="container">
        {/* Onboarding Header */}
        <div className="row justify-content-center text-center mb-4">
          <div className="col-lg-8">
            <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 fw-semibold mb-3 d-inline-flex align-items-center gap-1.5">
              <Sparkles size={14} /> Step 2 of 2: Skill Setup
            </span>
            <h2 className="fw-bolder display-6 mb-2" style={{ color: 'var(--text-primary)' }}>
              What skills have you learned so far?
            </h2>
            <p className="lead fs-6 text-muted mb-0">
              Select all technologies, frameworks, and programming languages you know. We'll use this to benchmark your readiness for{' '}
              <strong className="text-primary">{user?.targetRoleTitle || 'your target career'}</strong>.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 mx-auto" style={{ maxWidth: '800px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Skill Selection */}
          <div className="col-lg-8">
            <div className="card border p-4 shadow-sm">
              {/* Quick Picks Section */}
              <div className="mb-4">
                <label className="form-label fw-bold d-flex align-items-center gap-2 mb-2">
                  <Award size={18} className="text-primary" />
                  <span>Popular Student Skills (Click to Select)</span>
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {POPULAR_SKILLS.map((skillName) => {
                    const selected = isSkillSelected(skillName);
                    const catalogItem = catalogSkills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
                    return (
                      <button
                        key={skillName}
                        type="button"
                        className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-2 transition-all ${
                          selected
                            ? 'btn-primary shadow-sm'
                            : 'btn-outline-secondary'
                        }`}
                        onClick={() => {
                          if (catalogItem) {
                            handleToggleSkill(catalogItem);
                          } else {
                            // If not in catalog, treat as skill name
                            handleToggleSkill({ id: null, name: skillName, category: 'PROGRAMMING' });
                          }
                        }}
                      >
                        {selected ? <Check size={14} className="stroke-3" /> : <Plus size={14} />}
                        <span>{skillName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

              {/* Search & Categories Filter */}
              <div className="row g-3 mb-3">
                <div className="col-md-7">
                  <div className="input-group">
                    <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
                      <Search size={18} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search 40+ skills (e.g. C++, Pandas, Docker)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtered Skills Grid */}
              <div className="mb-4" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2 pt-1">
                    {filteredSkills.map((skill) => {
                      const selected = isSkillSelected(skill.name);
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5 ${
                            selected
                              ? 'btn-primary'
                              : 'btn-light border'
                          }`}
                          onClick={() => handleToggleSkill(skill)}
                        >
                          {selected ? <Check size={14} /> : <Plus size={14} />}
                          <span>{skill.name}</span>
                        </button>
                      );
                    })}
                    {filteredSkills.length === 0 && (
                      <p className="text-muted small py-3">No skills found matching your filter.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Add Custom Skill Box */}
              <div className="p-3 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                <span className="form-label fw-bold d-block mb-2">Can't find your skill? Add custom skill:</span>
                <form onSubmit={handleAddCustomSkill} className="row g-2">
                  <div className="col-sm-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Go, Rust, Figma, Next.js..."
                      value={customSkillName}
                      onChange={(e) => setCustomSkillName(e.target.value)}
                    />
                  </div>
                  <div className="col-sm-4">
                    <select
                      className="form-select form-select-sm"
                      value={customProficiency}
                      onChange={(e) => setCustomProficiency(e.target.value)}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <button type="submit" className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Skills Summary & Proficiency Selection */}
          <div className="col-lg-4">
            <div className="card border p-4 shadow-sm sticky-top" style={{ top: '80px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Selected Skills</h5>
                <span className="badge bg-primary rounded-pill px-2.5 py-1">
                  {selectedSkills.length} selected
                </span>
              </div>

              {selectedSkills.length === 0 ? (
                <div className="text-center py-5 text-muted border border-dashed rounded-3 p-4 mb-3">
                  <Compass size={36} className="text-muted mb-2 opacity-50" />
                  <p className="small mb-0">No skills selected yet.</p>
                  <p className="extra-small text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    Click on any skill chips on the left to add them to your profile.
                  </p>
                </div>
              ) : (
                <div className="mb-3" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  <div className="d-flex flex-column gap-2">
                    {selectedSkills.map((s) => (
                      <div
                        key={s.name}
                        className="p-2.5 rounded-3 border d-flex align-items-center justify-content-between gap-2"
                        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}
                      >
                        <div className="overflow-hidden">
                          <p className="mb-0 fw-semibold text-truncate small" style={{ color: 'var(--text-primary)' }}>
                            {s.name}
                          </p>
                          {s.isCustom && <span className="badge bg-secondary-subtle text-secondary extra-small" style={{ fontSize: '0.7rem' }}>Custom</span>}
                        </div>

                        <div className="d-flex align-items-center gap-1.5 flex-shrink-0">
                          <select
                            className="form-select form-select-sm py-0 px-2"
                            style={{ fontSize: '0.78rem', height: '28px' }}
                            value={s.proficiency}
                            onChange={(e) => handleProficiencyChange(s.name, e.target.value)}
                          >
                            <option value="BEGINNER">Beg</option>
                            <option value="INTERMEDIATE">Int</option>
                            <option value="ADVANCED">Adv</option>
                          </select>

                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger p-1"
                            onClick={() => handleRemoveSkill(s.name)}
                            title="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <button
                type="button"
                className="btn btn-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-2 shadow-sm"
                onClick={handleFinishOnboarding}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <span>Save & Check Skill Match</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-link text-muted btn-sm text-decoration-none text-center"
                onClick={handleSkip}
                disabled={submitting}
              >
                Skip for now & go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Initial Skill Match Celebration Modal */}
      {showResultModal && matchResult && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4 text-center">
              <div className="modal-body p-2">
                <div
                  className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 72,
                    height: 72,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981'
                  }}
                >
                  <TrendingUp size={36} />
                </div>

                <h3 className="fw-bolder mb-1" style={{ color: 'var(--text-primary)' }}>
                  Onboarding Complete!
                </h3>
                <p className="text-muted small mb-4">
                  Here is your baseline career readiness for{' '}
                  <strong className="text-primary">{matchResult.jobRoleTitle}</strong>:
                </p>

                {/* Score Circle */}
                <div className="match-score-circle match-high mb-3">
                  <span className="display-6 fw-bold">{matchResult.overallMatchPercentage}%</span>
                  <span className="extra-small text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>Match Score</span>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <div className="p-2 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                      <span className="d-block fw-bold fs-5 text-success">{matchResult.matchedSkillsCount}</span>
                      <span className="small text-muted">Skills Matched</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                      <span className="d-block fw-bold fs-5 text-warning">{matchResult.missingSkillsCount}</span>
                      <span className="small text-muted">Skills to Learn</span>
                    </div>
                  </div>
                </div>

                <p className="small text-muted mb-4 px-2">
                  {matchResult.aiSummaryRecommendation}
                </p>

                <button
                  type="button"
                  className="btn btn-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/dashboard')}
                >
                  <span>Go to My Dashboard</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
