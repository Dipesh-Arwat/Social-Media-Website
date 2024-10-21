const express = require('express');
const { createPost, getAllPosts, getPostById, likePost, commentOnPost ,fetchcomment} = require('../controllers/postController');
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/post', protect, upload.single('imageUrl'), createPost);
router.get('/posts', getAllPosts);
router.get('/post/:id', getPostById);
router.put('/post/:postId/like', protect, likePost);
router.post('/post/:postId/comment', protect, commentOnPost);
router.get('/post/:postId/comment', protect, fetchcomment);

module.exports = router;
