import axios from 'axios';

const api = axios.create({
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Bearer ${localStorage.getItem("Access-Token")}`,
    "Access-Control-Allow-Origin": 'http://localhost:8082',
    "Access-Control-Allow-Headers": "*",
  },
  withCredentials: true
});

export default api;