import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 my-auto">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5 col-xl-4">
            <div className="card p-4 p-sm-5 border shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3 shadow-sm">
                  <Compass size={32} />
                </div>
                <h3 className="fw-bolder mb-1" style={{ color: 'var(--text-primary)' }}>Welcome Back</h3>
                <p className="text-muted small">Sign in to your SkillGap AI account</p>
              </div>

              {isExpired && (
                <div className="alert alert-warning small d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} /> Your session has expired. Please log in again.
                </div>
              )}

              {error && (
                <div className="alert alert-danger small d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                      <Mail size={18} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold mb-0">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text border-end-0" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-muted small">Don't have an account? </span>
                <Link to="/register" className="fw-semibold text-primary small text-decoration-none">
                  Register as Student
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
