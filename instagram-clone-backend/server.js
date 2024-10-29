const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const storyRoutes = require('./routes/storyRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://social-media-website-ciuy.onrender.com',
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// app.options('*', cors({
//   origin: 'https://social-media-website-ciuy.onrender.com',
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));


// app.use(express.static('public', {
//   maxAge: '1d',
// }));
app.use(compression());
// app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes,);
app.use('/api', storyRoutes,);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React frontend app

// app.use(express.static(path.join(__dirname, 'insta-frontend/build')));

// // Fallback route: Send all other requests to React frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'insta-frontend/build', 'index.html'));
// });


app.get('/api', (req, res) => {
  res.json({ message: 'API working!' });
});

// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
