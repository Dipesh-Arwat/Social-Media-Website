Instagram Clone - Social Media Website

Description
This project is a fully functional Instagram clone built using the MERN stack (MongoDB, Express, React, Node.js). The app allows users to create an account, post pictures, like and comment on posts, follow/unfollow other users, and upload stories with a 24-hour expiration period, among other features.

You can view the live demo here.

Features
User Authentication: Users can register and log in securely using JWT authentication.
Profile Management: Users can edit their profiles, update their bio, and profile picture.
Posts: Users can upload images, like posts, and leave comments.
Stories: Users can upload stories with images or videos, viewable for 24 hours.
Responsive Design: The layout is optimized for mobile and desktop devices.
Likes & Comments: Users can like/unlike posts and add comments in real-time.
Search Functionality: Users can search for other users by username.
Followers & Following: Users can follow/unfollow other users and view follower/following lists.
Lazy Loading: For improved performance, components and images are lazy-loaded.
Animated Story View: Stories have progress bars and animations to improve the user experience.
Technologies Used
Frontend: React.js, CSS3, Font Awesome
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT (JSON Web Token)
Deployment: Render.com
Installation
To run this project locally, follow the steps below:

Clone the repository:

bash
Copy code
git clone https://github.com/Dipesh-Arwat/Social-Media-Website.git
Navigate to the project directory:

bash
Copy code
cd Social-Media-Website
Install dependencies:

bash
Copy code
npm install
Set up environment variables:
Create a .env file in the root directory and add the following environment variables:

bash
Copy code
MONGO_URI=your_mongoDB_connection_string
JWT_SECRET=your_jwt_secret

Start the server:

bash
Copy code
npm run dev
Access the application:
Open your browser and go to http://localhost:3000 to access the app.

Deployment
The app is deployed on Render.com.

Issues
If you encounter any problems, feel free to create an issue or pull request in the repository.
