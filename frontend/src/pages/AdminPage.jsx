import React, { useState, useEffect } from 'react';
import { adminApi, rolesApi, catalogSkillsApi, resourcesApi } from '../services/api';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  PlayCircle,
  ExternalLink,
  Clock
} from 'lucide-react';

export const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [newRole, setNewRole] = useState({
    title: '',
    description: '',
    industryDemand: 'VERY_HIGH',
    avgSalary: '₹6,00,000 - ₹12,00,000 / year',
  });

  const [mapSkill, setMapSkill] = useState({
    roleId: '',
    skillId: '',
    importance: 'REQUIRED',
    minProficiency: 'INTERMEDIATE',
    weight: 4,
  });

  const [newResource, setNewResource] = useState({
    skillName: '',
    title: '',
    topic: '',
    channelName: '',
    youtubeUrl: '',
    duration: '2 Hours',
    difficulty: 'BEGINNER',
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, rolesRes, skillsRes, resourcesRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getStudents(),
        rolesApi.getAllRoles(),
        catalogSkillsApi.getSkills(),
        resourcesApi.getAll(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) setStats(statsRes.value.data.data);
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.success) setStudents(studentsRes.value.data.data);
      if (rolesRes.status === 'fulfilled' && rolesRes.value.data?.success) setRoles(rolesRes.value.data.data);
      if (skillsRes.status === 'fulfilled' && skillsRes.value.data?.success) setSkills(skillsRes.value.data.data);
      if (resourcesRes.status === 'fulfilled' && resourcesRes.value.data?.success) setLearningResources(resourcesRes.value.data.data);
    } catch (err) {
      setError('Failed to load admin analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await adminApi.createRole(newRole);
      if (res.data?.success) {
        setSuccess(`Career role '${newRole.title}' created successfully!`);
        setNewRole({ title: '', description: '', industryDemand: 'VERY_HIGH', avgSalary: '₹6,00,000 - ₹12,00,000 / year' });
        await loadAdminData();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create role.');
    }
  };

  const handleMapSkillToRole = async (e) => {
    e.preventDefault();
    if (!mapSkill.roleId || !mapSkill.skillId) {
      setError('Please select both a career role and a skill.');
      return;
    }
    setSuccess('');
    setError('');
    try {
      const res = await adminApi.addSkillToRole(Number(mapSkill.roleId), {
        skillId: Number(mapSkill.skillId),
        importance: mapSkill.importance,
        minProficiency: mapSkill.minProficiency,
        weight: Number(mapSkill.weight),
      });
      if (res.data?.success) {
        setSuccess('Skill requirement mapped to career role successfully!');
        setMapSkill((prev) => ({ ...prev, skillId: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to map skill to role.');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await resourcesApi.create(newResource);
      if (res.data?.success) {
        setSuccess(`YouTube learning resource for '${newResource.skillName}' added successfully!`);
        setNewResource({
          skillName: '',
          title: '',
          topic: '',
          channelName: '',
          youtubeUrl: '',
          duration: '2 Hours',
          difficulty: 'BEGINNER',
        });
        const updated = await resourcesApi.getAll();
        if (updated.data?.success) setLearningResources(updated.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add learning resource.');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this learning resource?')) return;
    try {
      await resourcesApi.delete(id);
      setSuccess('Learning resource removed successfully.');
      setLearningResources(learningResources.filter((r) => r.id !== id));
    } catch (err) {
      setError('Failed to delete learning resource.');
    }
  };

  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        {/* Top Header */}
        <div className="card border p-4 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-danger text-white p-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 55, height: 55 }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle mb-1 small fw-bold">
                Administrator Panel
              </span>
              <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>System Analytics & Career Management</h3>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show small d-flex align-items-center gap-2 mb-4" role="alert">
            <CheckCircle2 size={16} /> {success}
            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
          </div>
        )}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show small d-flex align-items-center gap-2 mb-4" role="alert">
            <AlertCircle size={16} /> {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Stats Row */}
        {stats && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <div className="stat-card shadow-sm h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-semibold">Total Students</span>
                  <div className="bg-primary-subtle text-primary p-2 rounded-2">
                    <Users size={18} />
                  </div>
                </div>
                <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>{stats.totalStudents}</h3>
                <small className="text-muted">Registered accounts</small>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card shadow-sm h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-semibold">Career Roles</span>
                  <div className="bg-info-subtle text-info p-2 rounded-2">
                    <Briefcase size={18} />
                  </div>
                </div>
                <h3 className="fw-bold text-info mb-0">{stats.totalRoles}</h3>
                <small className="text-muted">Active job tracks</small>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card shadow-sm h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-semibold">Catalog Skills</span>
                  <div className="bg-success-subtle text-success p-2 rounded-2">
                    <Layers size={18} />
                  </div>
                </div>
                <h3 className="fw-bold text-success mb-0">{stats.totalSkills}</h3>
                <small className="text-muted">Tracked competencies</small>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="stat-card shadow-sm h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-semibold">AI Roadmaps</span>
                  <div className="bg-warning-subtle text-warning p-2 rounded-2">
                    <Sparkles size={18} />
                  </div>
                </div>
                <h3 className="fw-bold text-warning mb-0">{stats.totalRoadmaps}</h3>
                <small className="text-muted">Plans generated</small>
              </div>
            </div>
          </div>
        )}

        {/* Student Progress Roster */}
        <div className="card border p-4 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>Registered Students & Progress</h5>
            <span className="badge border px-2.5 py-1" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>{students.length} Total</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="small text-muted text-uppercase" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>College & Degree</th>
                  <th>Target Role</th>
                  <th>Skills Count</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.userId}>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{st.fullName}</strong>
                    </td>
                    <td className="small text-muted">{st.email}</td>
                    <td className="small">
                      <span className="d-block fw-semibold">{st.college || 'N/A'}</span>
                      <span className="text-muted">{st.degree || ''} {st.graduationYear ? `(${st.graduationYear})` : ''}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        {st.targetRole}
                      </span>
                    </td>
                    <td>
                      <span className="badge border" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                        {st.skillsCount} Skills
                      </span>
                    </td>
                    <td className="small text-muted">{st.registeredAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Configuration Forms */}
        <div className="row g-4 mb-4">
          {/* Create Job Role */}
          <div className="col-lg-6">
            <div className="card border p-4 h-100 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <h5 className="fw-bold mb-1 text-primary d-flex align-items-center gap-2">
                <Plus size={18} /> Add New Career Role
              </h5>
              <p className="text-muted small mb-3">Add a new career path to the platform benchmark.</p>

              <form onSubmit={handleCreateRole}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Role Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Cyber Security Analyst"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Key responsibilities and summary..."
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Industry Demand</label>
                    <select
                      className="form-select"
                      value={newRole.industryDemand}
                      onChange={(e) => setNewRole({ ...newRole, industryDemand: e.target.value })}
                    >
                      <option value="VERY_HIGH">VERY_HIGH</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Average Salary</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newRole.avgSalary}
                      onChange={(e) => setNewRole({ ...newRole, avgSalary: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-sm px-3 py-2">
                  Create Career Role
                </button>
              </form>
            </div>
          </div>

          {/* Map Required Skill to Role */}
          <div className="col-lg-6">
            <div className="card border p-4 h-100 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <h5 className="fw-bold mb-1 text-primary d-flex align-items-center gap-2">
                <Layers size={18} /> Map Required Skill to Role
              </h5>
              <p className="text-muted small mb-3">Configure skill expectations, importance, and weights.</p>

              <form onSubmit={handleMapSkillToRole}>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Career Role</label>
                    <select
                      className="form-select"
                      value={mapSkill.roleId}
                      onChange={(e) => setMapSkill({ ...mapSkill, roleId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Role --</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Skill to Add</label>
                    <select
                      className="form-select"
                      value={mapSkill.skillId}
                      onChange={(e) => setMapSkill({ ...mapSkill, skillId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Skill --</option>
                      {skills.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Importance</label>
                    <select
                      className="form-select"
                      value={mapSkill.importance}
                      onChange={(e) => setMapSkill({ ...mapSkill, importance: e.target.value })}
                    >
                      <option value="REQUIRED">REQUIRED</option>
                      <option value="PREFERRED">PREFERRED</option>
                    </select>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label small fw-semibold">Min Proficiency</label>
                    <select
                      className="form-select"
                      value={mapSkill.minProficiency}
                      onChange={(e) => setMapSkill({ ...mapSkill, minProficiency: e.target.value })}
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Weight (1-5)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="5"
                      value={mapSkill.weight}
                      onChange={(e) => setMapSkill({ ...mapSkill, weight: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-outline-primary btn-sm px-3 py-2">
                  Map Skill to Career Role
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* YOUTUBE LEARNING RESOURCES MANAGER                        */}
        {/* ========================================================= */}
        <div className="card border p-4 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-danger text-white p-2 rounded-3 shadow-xs">
                <PlayCircle size={20} />
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                  Configurable YouTube Learning Resources
                </h5>
                <p className="text-muted extra-small mb-0" style={{ fontSize: '0.8rem' }}>
                  Manage verified educational tutorials attached to student skill gaps and AI roadmap modules
                </p>
              </div>
            </div>
            <span className="badge bg-danger rounded-pill px-3 py-1.5">
              {learningResources.length} Configured Videos
            </span>
          </div>

          <div className="row g-4">
            {/* Add Resource Form */}
            <div className="col-lg-5">
              <div className="p-3.5 rounded-3 border" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <h6 className="fw-bold mb-2 text-danger d-flex align-items-center gap-1.5">
                  <Plus size={16} /> Add YouTube Learning Video
                </h6>
                <form onSubmit={handleCreateResource}>
                  <div className="mb-2">
                    <label className="form-label small">Target Skill Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Java, Spring Boot, React.js, SQL"
                      value={newResource.skillName}
                      onChange={(e) => setNewResource({ ...newResource, skillName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small">Video Title *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="e.g. Spring Boot Full Course"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-2">
                    <div className="col-sm-6">
                      <label className="form-label small">Channel Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="freeCodeCamp.org"
                        value={newResource.channelName}
                        onChange={(e) => setNewResource({ ...newResource, channelName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small">Duration</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="4 Hours"
                        value={newResource.duration}
                        onChange={(e) => setNewResource({ ...newResource, duration: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small">Verified YouTube URL *</label>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newResource.youtubeUrl}
                      onChange={(e) => setNewResource({ ...newResource, youtubeUrl: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-sm-6">
                      <label className="form-label small">Topic Summary</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="REST APIs & Microservices"
                        value={newResource.topic}
                        onChange={(e) => setNewResource({ ...newResource, topic: e.target.value })}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small">Difficulty</label>
                      <select
                        className="form-select form-select-sm"
                        value={newResource.difficulty}
                        onChange={(e) => setNewResource({ ...newResource, difficulty: e.target.value })}
                      >
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1.5 shadow-sm">
                    <Plus size={15} />
                    <span>Save YouTube Resource</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Resources List / Table */}
            <div className="col-lg-7">
              <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <table className="table table-hover align-middle mb-0">
                  <thead className="small text-muted text-uppercase" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                    <tr>
                      <th>Skill & Title</th>
                      <th>Channel</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learningResources.map((res) => (
                      <tr key={res.id}>
                        <td>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle extra-small mb-1">
                            {res.skillName}
                          </span>
                          <strong className="d-block small text-truncate" style={{ maxWidth: '220px', color: 'var(--text-primary)' }}>
                            {res.title}
                          </strong>
                        </td>
                        <td className="small text-muted">{res.channelName}</td>
                        <td className="extra-small text-muted" style={{ fontSize: '0.78rem' }}>{res.duration}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <a
                              href={res.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-danger p-1"
                              title="Open YouTube video"
                            >
                              <ExternalLink size={14} />
                            </a>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger p-1"
                              onClick={() => handleDeleteResource(res.id)}
                              title="Delete resource"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {learningResources.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted small py-4">
                          No learning resources configured.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
