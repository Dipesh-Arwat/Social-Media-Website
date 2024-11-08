const Post = require('../models/Post');
const User = require('../models/User');



const imageBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://social-media-website-backend-0xnf.onrender.com/api/uploads'
    : 'http://localhost:5000/api/uploads';


exports.createPost = async (req, res) => {
  const { caption } = req.body; // Destructure caption from the request body
  try {
    // Create new post with image URL and user ID
    const post = new Post({
      user: req.user._id, // Set the user ID from the request
      imageUrl: `${imageBaseUrl}/${req.file.filename}`, // Construct the image URL
      caption, // Set the caption
    });

    // Save the post to the database
    const savedPost = await post.save(); // Save the post and store the returned value

    // Find the user and add the post ID to their posts array
    await User.findByIdAndUpdate(req.user._id, { $push: { posts: savedPost._id } });

    // Respond with the saved post
    res.status(201).json(savedPost);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};


// Get all posts for the feed
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username profileImage').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username profileImage');
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/unlike a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user already liked the post
    if (post.likes.includes(req.user._id)) {
      // If the user already liked the post, remove the like
      post.likes.pull(req.user._id);
    } else {
      // If the user hasn't liked the post, add their like
      post.likes.push(req.user._id);
    }

    await post.save();

    // Return only the updated likes array
    res.status(200).json({ likes: post.likes });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Comment on a post
exports.commentOnPost = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = { user: req.user._id, text };
    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchcomment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('comments.user', 'username profileImage');
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

