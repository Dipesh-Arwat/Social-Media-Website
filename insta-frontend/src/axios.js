import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'https://social-media-website-backend-0xnf.onrender.com/api',
});

export default instance;
