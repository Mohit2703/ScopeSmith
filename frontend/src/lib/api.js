import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class callAPI {
  getToken(token) {
    if (token) return token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  async get(endpoint, params = {}, token = null) {
    try {
      const authToken = this.getToken(token);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        params,
      };
      if (authToken) {
        config.headers['Authorization'] = `Token ${authToken}`;
      }
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const apiError = new Error(error.response.data?.detail || error.response.data?.message || 'API request failed');
        apiError.response = error.response;
        apiError.data = error.response.data;
        apiError.status = error.response.status;
        throw apiError;
      }
      throw error;
    }
  }

  async uploadFile(endpoint, formData, onUploadProgress = null, token = null) {
    try {
      const authToken = this.getToken(token);
      const config = {
        headers: {},
        onUploadProgress,
      };
      if (authToken) {
        config.headers['Authorization'] = `Token ${authToken}`;
      }
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const apiError = new Error(error.response.data?.detail || error.response.data?.message || 'File upload failed');
        apiError.response = error.response;
        apiError.data = error.response.data;
        apiError.status = error.response.status;
        throw apiError;
      }
      throw error;
    }
  }

  async post(endpoint, data = {}, token = null) {
    try {
      const authToken = this.getToken(token);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (authToken) {
        config.headers['Authorization'] = `Token ${authToken}`;
      }
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const apiError = new Error(error.response.data?.detail || error.response.data?.message || 'API request failed');
        apiError.response = error.response;
        apiError.data = error.response.data;
        apiError.status = error.response.status;
        throw apiError;
      }
      throw error;
    }
  }

  async put(endpoint, data = {}, token = null) {
    try {
      const authToken = this.getToken(token);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (authToken) {
        config.headers['Authorization'] = `Token ${authToken}`;
      }
      const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const apiError = new Error(error.response.data?.detail || error.response.data?.message || 'API request failed');
        apiError.response = error.response;
        apiError.data = error.response.data;
        apiError.status = error.response.status;
        throw apiError;
      }
      throw error;
    }
  }

  async delete(endpoint, token = null) {
    try {
      const authToken = this.getToken(token);
      const config = {
        headers: {},
      };
      if (authToken) {
        config.headers['Authorization'] = `Token ${authToken}`;
      }
      const response = await axios.delete(`${API_BASE_URL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const apiError = new Error(error.response.data?.detail || error.response.data?.message || 'API request failed');
        apiError.response = error.response;
        apiError.data = error.response.data;
        apiError.status = error.response.status;
        throw apiError;
      }
      throw error;
    }
  }

  // Deprecated: Use individual methods instead, but kept for backward compatibility
  async callAPI(method, endpoint, data = {}, params = {}, token = null, onUploadProgress = null) {
    method = method.toLowerCase();
    // token logic is now handled in individual methods
    switch (method) {
      case 'get':
        return this.get(endpoint, params, token);
      case 'post':
        return this.post(endpoint, data, token);
      case 'put':
        return this.put(endpoint, data, token);
      case 'delete':
        return this.delete(endpoint, token);
      case 'upload':
        return this.uploadFile(endpoint, data, onUploadProgress, token);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
}

const api = new callAPI();
export default api;
