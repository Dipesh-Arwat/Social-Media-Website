const User = require('../models/User');
// const Story = require('../models/Story');


// Get user profile info
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('posts').populate('stories');

    // const stories = await Story.find({ user: userId });
   
    // res.status(200).json({ user, stories });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get the current authenticated user's profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('posts'); // Assuming req.user._id contains the user's ID
    if (user) {
      res.json(user); // Send back the user's data
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile by ID:', error.message); // Log the actual error
    res.status(500).json({ message: 'Server error' });
  }
};


// Search users by username
exports.searchUsers = async (req, res) => {
  const username = req.query.username;
  try {
    const users = await User.find({ username: new RegExp(username, 'i') }); // Case-insensitive search
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;

    // Log the file upload data for debugging
    if (req.file) {
      console.log('File uploaded:', req.file);
      user.profileImage = `https://social-media-website-backend-0xnf.onrender.com/api/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error.message); 
    res.status(500).json({ message: error.message });
  }
};


exports.getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('followers', 'username profileImage');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followers', error });
  }
};

exports.getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('following', 'username profileImage');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    console.error('Error fetching following:', error.message); // Log the actual error
    res.status(500).json({ message: 'Server error' });
  }
};

// Follow/unfollow user
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.body.userId);
    const currentUser = req.user;

    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    if (userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.pull(currentUser._id); // Unfollow logic
      currentUser.following.pull(userToFollow._id);
    } else {
      userToFollow.followers.push(currentUser._id); // Follow logic
      currentUser.following.push(userToFollow._id);
    }

    await userToFollow.save();
    await currentUser.save();

    res.status(200).json({ message: 'Follow/unfollow action successful' });
  } catch (error) {
    console.error('Error following/unfollowing user:', error.message); // Log the actual error
    res.status(500).json({ message: 'Server error' });
  }
};