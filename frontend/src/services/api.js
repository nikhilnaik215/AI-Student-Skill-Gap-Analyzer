import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ai-student-skill-gap-analyzer.onrender.com/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration or unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (studentData) => api.post('/auth/register', studentData),
};

// Profile Endpoints
export const profileApi = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (profileData) => api.put('/student/profile', profileData),
  setTargetRole: (roleId) => api.put(`/student/profile/target-role/${roleId}`),
  completeOnboarding: () => api.put('/student/profile/onboarding-complete'),
};

// Student Skills Endpoints
export const studentSkillsApi = {
  getMySkills: () => api.get('/student/skills'),
  addSkill: (skillData) => api.post('/student/skills', skillData),
  addSkillsBulk: (skillsList) => api.post('/student/skills/bulk', skillsList),
  updateSkill: (id, proficiency, yearsOfExperience) =>
    api.put(`/student/skills/${id}?proficiency=${proficiency}&yearsOfExperience=${yearsOfExperience || 0}`),
  deleteSkill: (id) => api.delete(`/student/skills/${id}`),
};

// Career Roles Endpoints
export const rolesApi = {
  getAllRoles: () => api.get('/roles'),
  getRoleById: (id) => api.get(`/roles/${id}`),
};

// Skills Catalog Endpoints
export const catalogSkillsApi = {
  getSkills: (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    return api.get(`/skills?${params.toString()}`);
  },
  createSkill: (data) => api.post('/skills', data),
};

// Skill Gap Analysis Endpoints
export const analysisApi = {
  analyzeTargetRole: () => api.get('/analysis/target'),
  analyzeRole: (roleId) => api.get(`/analysis/role/${roleId}`),
};

// AI Roadmap Endpoints
export const roadmapApi = {
  generateRoadmap: () => api.post('/roadmap/generate'),
  getMyRoadmaps: () => api.get('/roadmap/my-roadmaps'),
  getRoadmapById: (id) => api.get(`/roadmap/${id}`),
};

// Projects Endpoints
export const projectsApi = {
  getRecommendedProjects: () => api.get('/projects/recommended'),
  getAllProjects: () => api.get('/projects/all'),
};

// Resume Builder Endpoints
export const resumeApi = {
  getResume: () => api.get('/student/resume'),
  saveResume: (resumeData) => api.put('/student/resume', resumeData),
  autoPopulate: () => api.post('/student/resume/auto-populate'),
};

// AI Resume Analyzer Endpoints
export const resumeAnalyzerApi = {
  analyze: (data) => api.post('/resume-analyzer/analyze', data),
};

// YouTube Learning Resources Endpoints
export const resourcesApi = {
  getAll: () => api.get('/resources'),
  getBySkillName: (name) => api.get(`/resources/skill/${encodeURIComponent(name)}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

// Admin Endpoints
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getStudents: () => api.get('/admin/students'),
  createRole: (roleData) => api.post('/admin/roles', roleData),
  addSkillToRole: (roleId, skillData) => api.post(`/admin/roles/${roleId}/skills`, skillData),
  deleteRole: (roleId) => api.delete(`/admin/roles/${roleId}`),
};

export default api;
