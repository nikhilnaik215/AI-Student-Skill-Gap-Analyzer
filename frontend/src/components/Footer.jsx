import React from 'react';
import { Compass, Mail, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-top mt-auto py-4" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
      <div className="container">
        <div className="row align-items-center gy-3">
          {/* Brand & Developer */}
          <div className="col-lg-6 col-md-12">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-3 d-inline-flex shadow-sm">
                <Compass size={20} />
              </div>
              <span className="fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>SkillGap.AI</span>
              <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 small">
                Career Platform
              </span>
              <span className="mx-1" style={{ color: 'var(--border-color)' }}>•</span>
              <span className="fw-semibold text-primary">
                Developed by Nikhil Naik
              </span>
            </div>
            <p className="small mb-0 mt-2" style={{ color: 'var(--text-muted)' }}>
              Empowering students with AI skill diagnostics, role roadmaps, and career resume intelligence.
            </p>
          </div>

          {/* Contact & Tech Details */}
          <div className="col-lg-6 col-md-12 text-lg-end">
            <div className="d-inline-flex flex-column flex-sm-row align-items-lg-end align-items-start gap-2 gap-sm-3">
              <a
                href="mailto:working.nikhinaik@gamil.com"
                className="d-inline-flex align-items-center gap-2 text-decoration-none px-3 py-1.5 rounded-pill border"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem'
                }}
              >
                <Mail size={15} className="text-primary" />
                <span className="fw-medium">working.nikhinaik@gamil.com</span>
              </a>
              <div className="small" style={{ color: 'var(--text-muted)' }}>
                Java 21 • Spring Boot • MySQL • React.js
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
