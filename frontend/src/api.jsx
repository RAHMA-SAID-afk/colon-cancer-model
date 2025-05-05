import axios from 'axios';
const API = 'http://localhost:5000/api';

export const fetchCases = () => axios.get(`${API}/patients`);
export const createCase = (data) => axios.post(`${API}/patients`, data);
export const fetchPredictions = () => axios.get(`${API}/predictions`);
export const deleteCase = (id) => axios.delete(`http://localhost:5000/api/patients/${id}`);
export const updateCase = (id, data) => axios.put(`http://localhost:5000/api/patients/${id}`, data);
  