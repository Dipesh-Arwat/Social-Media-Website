import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://social-media-website-backend-0xnf.onrender.com/api', // Update this with your backend URL
});

export default instance;
