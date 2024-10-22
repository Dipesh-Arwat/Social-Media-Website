import React, { useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'
import '../Login/Login.css'

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
        <img class="logo" src={logo} alt="Instagram"></img>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <div className='redirect'>

      <p class="text">Already have an account?<a href="/login"> Login</a></p>
      </div>
    </div>
  );
};

export default Register;
