import axios from 'axios';

// Use environment variable for backend API URL, fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Department APIs
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
  search: (query) => api.get(`/departments/search?q=${query}`),
};

// Class APIs
export const classAPI = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  getByDepartment: (deptId) => api.get(`/classes/department/${deptId}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  search: (query) => api.get(`/classes/search?q=${query}`),
};

// Student APIs
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByClass: (classId) => api.get(`/students/class/${classId}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  search: (query) => api.get(`/students/search?q=${query}`),
};

// Attendance APIs
export const attendanceAPI = {
  mark: (data) => api.post('/attendance/mark', data),
  markBulk: (data) => api.post('/attendance/mark-bulk', data),
  getStudentAttendance: (studentId) => api.get(`/attendance/student/${studentId}`),
  getClassAttendance: (classId, date) => 
    api.get(`/attendance/class/${classId}${date ? `?date=${date}` : ''}`),
  getDepartmentAttendance: (deptId, date) => 
    api.get(`/attendance/department/${deptId}${date ? `?date=${date}` : ''}`),
  getTodayAttendance: () => api.get('/attendance/today'),
};

// Validation APIs
export const validationAPI = {
  validateAll: () => api.get('/validate/all'),
  validateDepartment: (id) => api.get(`/validate/department/${id}`),
  validateClass: (id) => api.get(`/validate/class/${id}`),
  validateStudent: (id) => api.get(`/validate/student/${id}`),
};

export default api;
