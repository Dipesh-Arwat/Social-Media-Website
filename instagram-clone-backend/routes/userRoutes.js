const express = require('express');
const { getUserProfile, updateUserProfile, followUser, searchUsers, getCurrentUser, getUserProfileById , getFollowers,getFollowing } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/user/:id', getUserProfile);
router.get('/currentUser', protect, getCurrentUser);
router.put('/user/edit', protect, upload.single('profileImage'), updateUserProfile);
router.post('/user/follow', protect, followUser);
router.get('/search', searchUsers); 
router.get('/user/:userId/followers', getFollowers);
router.get('/user/:userId/following', getFollowing);
router.get('/profile/:userId', getUserProfileById);

module.exports = router;
