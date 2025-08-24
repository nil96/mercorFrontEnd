import axios from 'axios';

const API_URL = '/api';

export async function fetchCandidates(filters = {}, page = 1, limit = 20) {
  try {
    const params = new URLSearchParams();
    
    // Add filters to params if they exist
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    // Add pagination params
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/candidates?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
}

export async function fetchCandidateByEmail(email) {
  try {
    const response = await axios.get(`${API_URL}/candidates/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    throw error;
  }
}