import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true, 
});

export default API;
