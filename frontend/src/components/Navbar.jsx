import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import {
  Compass,
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  FolderGit2,
  User,
  LogOut,
  ShieldCheck,
  Briefcase,
  FileText,
  ScanText
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-xl custom-navbar sticky-top py-2 shadow-sm">
      <div className="container-fluid px-lg-4">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none me-3" to={isAuthenticated ? '/dashboard' : '/'}>
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm">
            <Compass size={22} className="stroke-2" />
          </div>
          <div>
            <span className="fw-bolder text-primary fs-5">SkillGap</span>
            <span className="fw-bolder fs-5" style={{ color: 'var(--text-primary)' }}>.AI</span>
          </div>
        </Link>

        {/* Mobile Actions: Theme Toggle + Toggler */}
        <div className="d-flex align-items-center gap-2 d-xl-none ms-auto me-2">
          <ThemeToggle />
          <button
            className="navbar-toggler border-0 p-1"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-xl-0 ms-xl-2 gap-1">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    <LayoutDashboard size={17} />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/analysis">
                    <Compass size={17} />
                    <span>Gap Analysis</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/roadmap">
                    <Sparkles size={17} className="text-warning" />
                    <span>AI Roadmap</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/resume-builder">
                    <FileText size={17} className="text-primary" />
                    <span>Resume Builder</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/resume-analyzer">
                    <ScanText size={17} className="text-info" />
                    <span>AI Resume Analyzer</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/projects">
                    <FolderGit2 size={17} />
                    <span>Projects</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/skills">
                    <CheckSquare size={17} />
                    <span>My Skills</span>
                  </NavLink>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <NavLink className="nav-link text-danger fw-semibold" to="/admin">
                      <ShieldCheck size={17} />
                      <span>Admin Panel</span>
                    </NavLink>
                  </li>
                )}
              </ul>

              {/* Right Side: Theme Toggle + User Info */}
              <div className="d-flex align-items-center gap-2 mt-3 mt-xl-0">
                <div className="d-none d-xl-block">
                  <ThemeToggle />
                </div>

                {user?.targetRoleTitle && (
                  <span
                    className="badge rounded-pill border px-2.5 py-1.5 d-none d-xxl-flex align-items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <Briefcase size={13} className="text-primary" />
                    <span>{user.targetRoleTitle}</span>
                  </span>
                )}

                <div className="dropdown">
                  <button
                    className="btn border rounded-pill d-flex align-items-center gap-2 py-1.5 px-3"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
                      <User size={16} />
                    </div>
                    <span className="fw-semibold small">{user?.fullName?.split(' ')[0] || 'User'}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow mt-2" aria-labelledby="userDropdown">
                    <li className="px-3 py-2 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                      <p className="mb-0 fw-bold small" style={{ color: 'var(--text-primary)' }}>{user?.fullName}</p>
                      <p className="mb-0 text-muted extra-small" style={{ fontSize: '0.8rem' }}>{user?.email}</p>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile">
                        <User size={16} />
                        <span>Profile & Career Role</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/resume-builder">
                        <FileText size={16} />
                        <span>My Resume</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/resume-analyzer">
                        <ScanText size={16} />
                        <span>ATS Resume Check</span>
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-1" style={{ borderColor: 'var(--border-color)' }} /></li>
                    <li>
                      <button className="dropdown-item d-flex align-items-center gap-2 text-danger py-2" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2 ms-auto">
              <ThemeToggle />
              <Link to="/login" className="btn btn-outline-primary px-3">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary px-3 shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
