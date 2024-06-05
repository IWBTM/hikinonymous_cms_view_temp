import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Token": localStorage.getItem("AccessToken")
  },
});

api.defaults.withCredentials = true;

export default api;