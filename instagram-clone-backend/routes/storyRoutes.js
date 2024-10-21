const express = require('express');
const { addStory, getStories, viewStory,getStoryById } = require('../controllers/storyController');
const protect  = require('../middlewares/authMiddleware'); 
const upload = require('../middlewares/uploadMiddleware'); 

const router = express.Router();


router.post('/stories/add', protect, upload.single('media'), addStory);

router.get('/stories', protect, getStories);
router.get('/stories/:storyId', protect, getStoryById); 

router.post('/stories/:storyId/view', protect, viewStory);

module.exports = router;
