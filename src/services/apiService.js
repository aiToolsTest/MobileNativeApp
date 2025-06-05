// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://bank-poc-api-func.azurewebsites.net/api';

// 🔐 Login API with logs
export const loginUser = async (email, password) => {
  try {
    console.log('📡 API Call: Logging in...');
    console.log('📝 Payload:', { email, password });

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    console.log('✅ API Response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network or Axios Error:', error.message);
    }
    throw error;
  }
};

// Fetch accounts for a userId
export const fetchAccounts = async (userId) => {
  console.log('📡 Fetching accounts for userId:', userId);
  try {
    const response = await axios.get(`${API_BASE_URL}/accounts/user/${userId}`);
    console.log('✅ Accounts fetched:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Fetch accounts error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network or Axios Error:', error.message);
    }
    throw error;
  }
};

// ✅ Still available: Dummy Balance API (for test dashboards)
export const fetchDummyBalance = async () => {
  try {
    console.log('📡 API Call: Fetching balance from RESTful API...');
    const response = await fetch('https://api.restful-api.dev/objects/7');
    const data = await response.json();
    console.log('✅ API Response:', data);
    return parseFloat(data.data?.price || 0).toFixed(2);
  } catch (error) {
    console.error('❌ API Error:', error);
    return '0.00';
  }
};
