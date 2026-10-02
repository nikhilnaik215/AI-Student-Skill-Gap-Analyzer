import React, { useState, useEffect } from 'react';
import { profileApi, rolesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';

export const ProfilePage = () => {
  const { updateTargetRoleInContext } = useAuth();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    graduationYear: 2025,
    bio: '',
    targetRoleId: '',
    targetRoleTitle: '',
    linkedinUrl: '',
    githubUrl: '',
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, rolesRes] = await Promise.all([
          profileApi.getProfile(),
          rolesApi.getAllRoles(),
        ]);

        if (rolesRes.data?.success) {
          setRoles(rolesRes.data.data);
        }

        if (profRes.data?.success) {
          const p = profRes.data.data;
          setProfile({
            fullName: p.fullName || '',
            email: p.email || '',
            phone: p.phone || '',
            college: p.college || '',
            degree: p.degree || '',
            graduationYear: p.graduationYear || 2025,
            bio: p.bio || '',
            targetRoleId: p.targetRoleId || '',
            targetRoleTitle: p.targetRoleTitle || '',
            linkedinUrl: p.linkedinUrl || '',
            githubUrl: p.githubUrl || '',
          });
        }
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    const selectedRole = roles.find((r) => r.id === Number(roleId));
    setProfile((prev) => ({
      ...prev,
      targetRoleId: roleId,
      targetRoleTitle: selectedRole ? selectedRole.title : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const payload = {
        ...profile,
        targetRoleId: profile.targetRoleId ? Number(profile.targetRoleId) : null,
        graduationYear: profile.graduationYear ? Number(profile.graduationYear) : null,
      };

      const res = await profileApi.updateProfile(payload);
      if (res.data?.success) {
        setSuccess('Profile and career preferences saved successfully!');
        if (payload.targetRoleId) {
          updateTargetRoleInContext(payload.targetRoleId, profile.targetRoleTitle);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status"></div>
      </div>
    );
  }

  const currentRole = roles.find((r) => r.id === Number(profile.targetRoleId));

  return (
    <div className="py-4 py-lg-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {/* Header */}
            <div className="custom-card p-4 mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 60, height: 60 }}>
                  <User size={30} />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">{profile.fullName || 'Student Profile'}</h3>
                  <span className="text-muted small">{profile.email}</span>
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

            {/* Profile Form */}
            <form onSubmit={handleSubmit}>
              {/* Career Goal Section */}
              <div className="custom-card p-4 p-md-5 mb-4">
                <h5 className="fw-bold mb-1 text-primary d-flex align-items-center gap-2">
                  <Briefcase size={20} /> Target Career Role
                </h5>
                <p className="text-muted small mb-4">
                  Select your primary career aspiration. Your skill gap percentage and AI roadmaps will calibrate to this benchmark.
                </p>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Selected Career Role</label>
                  <select
                    name="targetRoleId"
                    className="form-select form-select-lg"
                    value={profile.targetRoleId}
                    onChange={handleRoleChange}
                    required
                  >
                    <option value="">-- Choose Career Role --</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.industryDemand} Demand)
                      </option>
                    ))}
                  </select>
                </div>

                {currentRole && (
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-dark">{currentRole.title}</strong>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        {currentRole.avgSalary}
                      </span>
                    </div>
                    <p className="text-muted small mb-0">{currentRole.description}</p>
                  </div>
                )}
              </div>

              {/* Academic & Contact Info */}
              <div className="custom-card p-4 p-md-5 mb-4">
                <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                  <GraduationCap size={20} className="text-primary" /> Academic & Contact Information
                </h5>
                <p className="text-muted small mb-4">Provide your university background and profile details.</p>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={profile.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      placeholder="+91 9876543210"
                      value={profile.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">College / University</label>
                    <input
                      type="text"
                      name="college"
                      className="form-control"
                      value={profile.college}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Degree Program</label>
                    <input
                      type="text"
                      name="degree"
                      className="form-control"
                      value={profile.degree}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small fw-semibold">Passout Year</label>
                    <input
                      type="number"
                      name="graduationYear"
                      className="form-control"
                      value={profile.graduationYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold">Career Bio / Summary</label>
                  <textarea
                    name="bio"
                    className="form-control"
                    rows="3"
                    placeholder="Short summary of your career interests, key strengths, and project aspirations..."
                    value={profile.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">GitHub Profile URL</label>
                    <input
                      type="url"
                      name="githubUrl"
                      className="form-control"
                      placeholder="https://github.com/username"
                      value={profile.githubUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      className="form-control"
                      placeholder="https://linkedin.com/in/username"
                      value={profile.linkedinUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2.5 shadow-sm d-inline-flex align-items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Developer Contact Card */}
            <div className="card p-3.5 border shadow-sm mt-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-2.5">
                  <div className="bg-primary text-white p-2 rounded-3">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="fw-bold d-block small" style={{ color: 'var(--text-primary)' }}>
                      SkillGap.AI Platform Developer
                    </span>
                    <span className="extra-small text-muted" style={{ fontSize: '0.8rem' }}>
                      Developed by <strong>Nikhil Naik</strong>
                    </span>
                  </div>
                </div>
                <a
                  href="mailto:working.nikhinaik@gamil.com"
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5"
                >
                  <Mail size={14} />
                  <span>working.nikhinaik@gamil.com</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
