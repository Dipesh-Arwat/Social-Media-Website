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
app.use(cors());
app.use(express.static('public', {
    maxAge: '1d', 
  }));
  app.use(compression());
  app.use('/static', express.static(path.join(__dirname, 'public')));  

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes,);
app.use('/api', storyRoutes,);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/",(req,res)=>{
  res.send("API Working")
})

// Listen on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
