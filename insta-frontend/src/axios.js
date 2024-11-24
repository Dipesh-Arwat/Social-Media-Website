import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://social-media-website-backend-hv10.onrender.com/api',
});

export default instance;
