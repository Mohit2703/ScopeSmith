import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class callAPI {
  async get(endpoint, params = {}, token = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        params,
      };
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  async uploadFile(endpoint, formData, onUploadProgress = null, token = null) {
    try {
      const config = {
        headers: {},
        onUploadProgress,
      };
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  async post(endpoint, data = {}, token = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  async put(endpoint, data = {}, token = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
      const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  async delete(endpoint, token = null) {
    try {
      const config = {
        headers: {},
      };
      if (token) {
        config.headers['Authorization'] = `Token ${token}`;
      }
      const response = await axios.delete(`${API_BASE_URL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  async callAPI(method, endpoint, data = {}, params = {}, token = null, onUploadProgress = null) {
    method = method.toLowerCase();
    token = token || localStorage.getItem('auth_token');
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
