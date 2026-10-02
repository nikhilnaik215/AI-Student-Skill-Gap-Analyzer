
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rolesApi } from '../services/api';
import {
  Compass,
  User,
  Mail,
  Lock,
  GraduationCap,
  Briefcase,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    college: '',
    degree: '',
    graduationYear: '',
    targetRoleId: '',
  });

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        setError('');

        const res = await rolesApi.getAllRoles();

        const roleData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data?.content)
              ? res.data.content
              : [];

        setRoles(roleData);

        if (roleData.length === 0) {
          setError('No career roles found. Please try again later.');
        }
      } catch (err) {
        console.error('Failed to load career roles:', err);
        setError('Unable to load career roles. Please try again later.');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.targetRoleId) {
      setError('Please select a target career role.');
      return;
    }

    setLoading(true);

    try {
      await register({
        ...formData,
        targetRoleId: Number(formData.targetRoleId),
        graduationYear: formData.graduationYear
          ? Number(formData.graduationYear)
          : null,
      });

      navigate('/onboarding');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    flex: '1 1 0%',
    minWidth: 0,
    width: '1%',
    height: '48px',
    backgroundColor: 'var(--bg-subtle)',
    color: 'var(--text-primary)',
  };

  const iconStyle = {
    display: 'flex',
    flex: '0 0 48px',
    width: '48px',
    height: '48px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-subtle)',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    width: '100%',
  };

  return (
    <div className="py-5 my-auto">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <div
              className="card p-3 p-md-5 border shadow-sm"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              <div className="text-center mb-4">
                <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3 shadow-sm">
                  <Compass size={32} />
                </div>

                <h3
                  className="fw-bolder mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Create Student Account
                </h3>

                <p className="text-muted small">
                  Start analyzing your career readiness and generating AI roadmaps
                </p>
              </div>

              {error && (
                <div className="alert alert-danger small d-flex align-items-center gap-2 mb-4">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Full Name and Email */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Full Name *
                    </label>

                    <div
                      className="input-group"
                      style={inputGroupStyle}
                    >
                      <span
                        className="input-group-text border-end-0"
                        style={iconStyle}
                      >
                        <User size={18} className="text-muted" />
                      </span>

                      <input
                        type="text"
                        name="fullName"
                        className="form-control border-start-0"
                        style={inputStyle}
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Email Address *
                    </label>

                    <div
                      className="input-group"
                      style={inputGroupStyle}
                    >
                      <span
                        className="input-group-text border-end-0"
                        style={iconStyle}
                      >
                        <Mail size={18} className="text-muted" />
                      </span>

                      <input
                        type="email"
                        name="email"
                        className="form-control border-start-0"
                        style={inputStyle}
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password and Career Role */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Password *
                    </label>

                    <div
                      className="input-group"
                      style={inputGroupStyle}
                    >
                      <span
                        className="input-group-text border-end-0"
                        style={iconStyle}
                      >
                        <Lock size={18} className="text-muted" />
                      </span>

                      <input
                        type="password"
                        name="password"
                        className="form-control border-start-0"
                        style={inputStyle}
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Target Career Role *
                    </label>

                    <div
                      className="input-group"
                      style={inputGroupStyle}
                    >
                      <span
                        className="input-group-text border-end-0"
                        style={iconStyle}
                      >
                        <Briefcase size={18} className="text-muted" />
                      </span>

                      <select
                        name="targetRoleId"
                        className="form-select border-start-0"
                        style={inputStyle}
                        value={formData.targetRoleId}
                        onChange={handleChange}
                        required
                        disabled={rolesLoading || roles.length === 0}
                      >
                        <option value="">
                          {rolesLoading
                            ? 'Loading career roles...'
                            : roles.length === 0
                              ? 'No career roles available'
                              : 'Select Target Career'}
                        </option>

                        {roles.map((role) => {
                          const roleId = role.id ?? role.roleId;
                          const roleName =
                            role.title ?? role.name ?? role.roleName;

                          return (
                            <option key={roleId} value={roleId}>
                              {roleName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                {/* College, Degree and Graduation Year */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      College / University
                    </label>

                    <div
                      className="input-group"
                      style={inputGroupStyle}
                    >
                      <span
                        className="input-group-text border-end-0"
                        style={iconStyle}
                      >
                        <GraduationCap size={18} className="text-muted" />
                      </span>

                      <input
                        type="text"
                        name="college"
                        className="form-control border-start-0"
                        style={inputStyle}
                        placeholder="Enter college name"
                        value={formData.college}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Degree / Program
                    </label>

                    <input
                      type="text"
                      name="degree"
                      className="form-control"
                      style={{
                        ...inputStyle,
                        width: '100%',
                      }}
                      placeholder="e.g. B.Tech CSE"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Passout Year
                    </label>

                    <input
                      type="number"
                      name="graduationYear"
                      className="form-control"
                      style={{
                        ...inputStyle,
                        width: '100%',
                      }}
                      placeholder="e.g. 2027"
                      min={2020}
                      max={2035}
                      value={formData.graduationYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2 shadow-xs"
                  disabled={loading || rolesLoading || roles.length === 0}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div
                className="text-center mt-3 pt-3 border-top"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="text-muted small">
                  Already have an account?{' '}
                </span>

                <Link
                  to="/login"
                  className="fw-semibold text-primary small text-decoration-none"
                >
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