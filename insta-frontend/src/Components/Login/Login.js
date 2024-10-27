import React, { useState } from 'react';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Manage password visibility
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validation
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        
        try {
            const response = await axios.post('/login', { email, password });
            const token = response.data.token;
            const userProfileImage = response.data.profileImage;

            // Save the token and profile image in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('profileImage', userProfileImage);

            // Set the authentication state to true
            setIsAuthenticated(true);

            // Redirect to the feed page
            navigate('/feed');
            window.location.reload();
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Incorrect email or password. Please try again.');
        }
    };

    return (
        <div className="auth-container ">
         
                <img className="logo" src={logo} alt="Instagram" loading="lazy" />
   

            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className='login-input'
                />
                
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}  // Toggle input type based on showPassword state
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className='pass-input'
                    />
                    <div
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}  // Toggle visibility
                    >
                        {showPassword ? (
                            <FontAwesomeIcon icon={faEye} /> // Hide icon
                        ) : (
                            <FontAwesomeIcon icon={faEyeSlash} /> // Show icon
                        )}
                    </div>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>
            <div className='redirect'>
                <p className="text">Don't have an account?<a href="/register"> Sign up</a></p>
            </div>
        </div>
    );
};

export default Login;
