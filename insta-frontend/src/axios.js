import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
  ? 'https://social-media-website-backend-0xnf.onrender.com/api' 
  : 'http://localhost:5000/api',
});

export default instance;
