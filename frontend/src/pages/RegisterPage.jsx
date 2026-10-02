import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rolesApi } from '../services/api';
import { Compass, User, Mail, Lock, GraduationCap, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    college: '',
    degree: 'B.Tech in Computer Science',
    graduationYear: 2025,
    targetRoleId: '',
  });

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await rolesApi.getAllRoles();
        if (res.data && res.data.data) {
          setRoles(res.data.data);
          if (res.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, targetRoleId: res.data.data[0].id }));
          }
        }
      } catch (err) {
        console.error('Failed to load roles', err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        ...formData,
        targetRoleId: formData.targetRoleId ? Number(formData.targetRoleId) : null,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null,
      });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 my-auto">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-7">
            <div className="card p-4 p-md-5 border shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3 shadow-sm">
                  <Compass size={32} />
                </div>
                <h3 className="fw-bolder mb-1" style={{ color: 'var(--text-primary)' }}>Create Student Account</h3>
                <p className="text-muted small">Start analyzing your career readiness and generating AI roadmaps</p>
              </div>

              {error && (
                <div className="alert alert-danger small d-flex align-items-center gap-2 mb-4">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <User size={18} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control border-start-0"
                        placeholder="Nihar Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <Mail size={18} className="text-muted" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0"
                        placeholder="nihar@college.edu"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Password *</label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <Lock size={18} className="text-muted" />
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control border-start-0"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Target Career Role *</label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <Briefcase size={18} className="text-muted" />
                      </span>
                      <select
                        name="targetRoleId"
                        className="form-select border-start-0"
                        value={formData.targetRoleId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Target Career...</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-5">
                    <label className="form-label small fw-semibold">College / University</label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <GraduationCap size={18} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        name="college"
                        className="form-control border-start-0"
                        placeholder="ABC Engineering College"
                        value={formData.college}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Degree / Program</label>
                    <input
                      type="text"
                      name="degree"
                      className="form-control"
                      placeholder="B.Tech CSE"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Passout Year</label>
                    <input
                      type="number"
                      name="graduationYear"
                      className="form-control"
                      min={2020}
                      max={2030}
                      value={formData.graduationYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 mb-3 d-flex align-items-center justify-content-center gap-2 shadow-xs"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-muted small">Already have an account? </span>
                <Link to="/login" className="fw-semibold text-primary small text-decoration-none">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
