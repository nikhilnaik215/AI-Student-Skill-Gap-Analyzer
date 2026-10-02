import React, { useState, useEffect } from 'react';
import { studentSkillsApi, catalogSkillsApi } from '../services/api';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const SkillsPage = () => {
  const [mySkills, setMySkills] = useState([]);
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Add form state
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [years, setYears] = useState(1);
  const [isCustom, setIsCustom] = useState(false);

  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const loadSkillsData = async () => {
    setLoading(true);
    try {
      const [myRes, catRes] = await Promise.all([
        studentSkillsApi.getMySkills(),
        catalogSkillsApi.getSkills(),
      ]);

      if (myRes.data?.success) {
        setMySkills(myRes.data.data);
      }
      if (catRes.data?.success) {
        setCatalogSkills(catRes.data.data);
      }
    } catch (err) {
      setErrorMessage('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillsData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        proficiency,
        yearsOfExperience: Number(years),
      };

      if (isCustom) {
        if (!customSkillName.trim()) {
          setErrorMessage('Please enter a custom skill name.');
          setActionLoading(false);
          return;
        }
        payload.customSkillName = customSkillName.trim();
      } else {
        if (!selectedSkillId) {
          setErrorMessage('Please select a skill from the catalog.');
          setActionLoading(false);
          return;
        }
        payload.skillId = Number(selectedSkillId);
      }

      const res = await studentSkillsApi.addSkill(payload);
      if (res.data?.success) {
        setSuccessMessage('Skill added to your profile successfully!');
        setSelectedSkillId('');
        setCustomSkillName('');
        setIsCustom(false);
        await loadSkillsData();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to add skill.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProficiency = async (skillId, newProficiency, currentYears) => {
    try {
      await studentSkillsApi.updateSkill(skillId, newProficiency, currentYears);
      setSuccessMessage('Proficiency level updated!');
      await loadSkillsData();
    } catch (err) {
      setErrorMessage('Failed to update proficiency level.');
    }
  };

  const handleDeleteSkill = async (skillId, skillName) => {
    if (!window.confirm(`Are you sure you want to remove '${skillName}' from your profile?`)) {
      return;
    }
    try {
      await studentSkillsApi.deleteSkill(skillId);
      setSuccessMessage(`'${skillName}' removed from your profile.`);
      setMySkills((prev) => prev.filter((s) => s.id !== skillId));
    } catch (err) {
      setErrorMessage('Failed to delete skill.');
    }
  };

  const mySkillIds = new Set(mySkills.map((s) => s.skillId));
  const availableCatalogSkills = catalogSkills.filter((s) => !mySkillIds.has(s.id));

  // Filter student skills
  const filteredMySkills = mySkills.filter((s) => {
    const matchesSearch = s.skillName.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || s.skillCategory === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', 'PROGRAMMING', 'FRAMEWORK', 'DATABASE', 'WEB_DEVELOPMENT', 'AI_DATA_SCIENCE', 'CLOUD_DEVOPS', 'SOFTWARE_ENGINEERING'];

  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        {/* Header */}
        <div className="row align-items-center mb-4 gy-2">
          <div className="col-md-8">
            <h2 className="fw-bold mb-1">My Technical Skills</h2>
            <p className="text-muted mb-0">
              Declare your skills and proficiency levels to receive accurate skill gap analysis and tailored roadmaps.
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
              Total Skills: {mySkills.length}
            </span>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show small d-flex align-items-center gap-2 mb-4" role="alert">
            <CheckCircle2 size={16} /> {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show small d-flex align-items-center gap-2 mb-4" role="alert">
            <AlertCircle size={16} /> {errorMessage}
            <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Add Skill Form Card */}
          <div className="col-lg-4">
            <div className="custom-card p-4 sticky-top" style={{ top: '5.5rem' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-primary-subtle text-primary p-2 rounded-2">
                  <Plus size={20} />
                </div>
                <h5 className="fw-bold mb-0">Add Skill to Profile</h5>
              </div>

              <form onSubmit={handleAddSkill}>
                {/* Catalog vs Custom Toggle */}
                <div className="btn-group w-100 mb-3" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${!isCustom ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setIsCustom(false)}
                  >
                    From 40+ Catalog
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${isCustom ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setIsCustom(true)}
                  >
                    Custom Skill
                  </button>
                </div>

                {!isCustom ? (
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Skill</label>
                    <select
                      className="form-select"
                      value={selectedSkillId}
                      onChange={(e) => setSelectedSkillId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose from Catalog --</option>
                      {availableCatalogSkills.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.category?.replace(/_/g, ' ')})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Skill Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. GraphQL, Tailwind, Kotlin"
                      value={customSkillName}
                      onChange={(e) => setCustomSkillName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Proficiency Level</label>
                  <select
                    className="form-select"
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value)}
                  >
                    <option value="BEGINNER">Beginner (Basic understanding)</option>
                    <option value="INTERMEDIATE">Intermediate (Built projects with it)</option>
                    <option value="ADVANCED">Advanced (Deep mastery & production experience)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Years of Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="15"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-1.5" disabled={actionLoading}>
                  {actionLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Add to My Profile</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Current Skills List */}
          <div className="col-lg-8">
            <div className="custom-card p-4">
              {/* Search and Filters */}
              <div className="row g-2 mb-3">
                <div className="col-md-7">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white border-end-0">
                      <Search size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search my skills..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <select
                    className="form-select form-select-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c === 'ALL' ? 'All Categories' : c.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : filteredMySkills.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <Layers size={40} className="mb-2 text-muted opacity-50" />
                  <p className="mb-1 fw-semibold">No skills found.</p>
                  <small>Add your programming languages, frameworks, and tools using the form on the left.</small>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-muted text-uppercase">
                      <tr>
                        <th>Skill Name</th>
                        <th>Category</th>
                        <th>Proficiency</th>
                        <th>Experience</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMySkills.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong className="text-dark">{item.skillName}</strong>
                          </td>
                          <td>
                            <span className="badge bg-light text-secondary border small">
                              {item.skillCategory?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td>
                            <select
                              className={`form-select form-select-sm py-0.5 px-2 fw-semibold rounded-pill badge-${item.proficiency?.toLowerCase()}`}
                              style={{ width: 'auto', border: 'none', cursor: 'pointer' }}
                              value={item.proficiency}
                              onChange={(e) => handleUpdateProficiency(item.id, e.target.value, item.yearsOfExperience)}
                            >
                              <option value="BEGINNER">BEGINNER</option>
                              <option value="INTERMEDIATE">INTERMEDIATE</option>
                              <option value="ADVANCED">ADVANCED</option>
                            </select>
                          </td>
                          <td>
                            <span className="small text-muted d-flex align-items-center gap-1">
                              <Clock size={13} /> {item.yearsOfExperience || 0} yr{item.yearsOfExperience !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-outline-danger btn-sm p-1.5 rounded-2"
                              title="Delete Skill"
                              onClick={() => handleDeleteSkill(item.id, item.skillName)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default SkillsPage;
