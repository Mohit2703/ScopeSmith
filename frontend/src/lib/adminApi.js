// Admin API service for admin panel
import api from './api';

export const adminApi = {
    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard/'),

    // Users
    getUsers: (params = {}) => api.get('/admin/users/', params),
    getUser: (id) => api.get(`/admin/users/${id}/`),
    createUser: (data) => api.post('/admin/users/', data),
    updateUser: (id, data) => api.put(`/admin/users/${id}/`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}/`),
    toggleUser: (id) => api.post(`/admin/users/${id}/toggle/`),

    // Project Types
    getProjectTypes: (params = {}) => api.get('/admin/project-types/', params),
    getProjectType: (id) => api.get(`/admin/project-types/${id}/`),
    createProjectType: (data) => api.post('/admin/project-types/', data),
    updateProjectType: (id, data) => api.put(`/admin/project-types/${id}/`, data),
    deleteProjectType: (id) => api.delete(`/admin/project-types/${id}/`),
    toggleProjectType: (id) => api.post(`/admin/project-types/${id}/toggle/`),

    // Projects
    getProjects: (params = {}) => api.get('/admin/projects/', params),
    getProject: (id) => api.get(`/admin/projects/${id}/`),
    updateProject: (id, data) => api.put(`/admin/projects/${id}/`, data),
    deleteProject: (id) => api.delete(`/admin/projects/${id}/`),

    // Questions
    getQuestions: (params = {}) => api.get('/admin/questions/', params),
    getQuestion: (id) => api.get(`/admin/questions/${id}/`),
    createQuestion: (data) => api.post('/admin/questions/', data),
    updateQuestion: (id, data) => api.put(`/admin/questions/${id}/`, data),
    deleteQuestion: (id) => api.delete(`/admin/questions/${id}/`),
    toggleQuestion: (id) => api.post(`/admin/questions/${id}/toggle/`),
    reorderQuestions: (projectTypeId, questionOrder) =>
        api.post('/admin/questions/reorder/', { project_type_id: projectTypeId, question_order: questionOrder }),

    // AI Questions
    getAIQuestions: (params = {}) => api.get('/admin/ai-questions/', params),

    // Reports
    getReports: (params = {}) => api.get('/admin/reports/', params),
    getReport: (id) => api.get(`/admin/reports/${id}/`),
    deleteReport: (id) => api.delete(`/admin/reports/${id}/`),
    regenerateReport: (projectId) => api.post(`/admin/reports/${projectId}/regenerate/`),

    // Settings
    getSettings: () => api.get('/admin/settings/'),
    updateSettings: (data) => api.put('/admin/settings/', data),
};

export default adminApi;
