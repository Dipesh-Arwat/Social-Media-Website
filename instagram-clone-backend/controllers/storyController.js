const Story = require('../models/Story');
const User = require('../models/User');


const imageBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://social-media-website-backend-hv10.onrender.com/api/uploads'
    : 'http://localhost:5000/api/uploads';


// Add a new story
exports.addStory = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  const { type } = req.body;

  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const story = new Story({
      user: req.user._id,
      mediaUrl: `${imageBaseUrl}/${req.file.filename}`,
      type,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const savedStory = await story.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { stories: story._id } });
    res.status(201).json(savedStory);
  } catch (error) {
    console.error('Error saving story:', error); // Log error details
    res.status(500).json({ message: error.message });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const story = await Story.find({ user: userId });
    // const story = await Story.find({ userId: req.params.userId });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch stories of users followed by the current user
exports.getStories = async (req, res) => {
  try {

    const user = await User.findById(req.user._id).populate('following', 'username profileImage');
    const followingIds = user.following.map(following => following._id);


    const stories = await Story.find({
      user: { $in: [...followingIds, req.user._id] },
      expiresAt: { $gt: new Date() },
    }).populate('user', 'username profileImage').sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a story as viewed by the current user
exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if the user has already viewed the story
    if (!story.viewers.includes(req.user._id)) {
      // Add the user's ID to the viewers array
      story.viewers.push(req.user._id);
      await story.save();
    }

    res.status(200).json({ message: 'Story viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
