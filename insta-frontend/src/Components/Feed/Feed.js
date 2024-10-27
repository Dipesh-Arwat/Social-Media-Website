import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import './Feed.css';
import StoryList from '../StoryList/StoryList';
import StoryViewModal from '../StoryViewModal/StoryViewModal';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [userId] = useState(localStorage.getItem('userId'));
  const [commentText, setCommentText] = useState('');
  const [activePostId, setActivePostId] = useState(null);
  const [stories, setStories] = useState([]);
  const [viewedStory, setViewedStory] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('/posts');
      const postsWithLikeStatus = res.data.map(post => ({
        ...post,
        likedByUser: post.likes.includes(userId),
      }));
      setPosts(postsWithLikeStatus);
      // setPosts(res.data);
    };
    fetchPosts();
  }, [userId]);

  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/post/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: response.data.likes, likedByUser: !post.likedByUser }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      if (activePostId === postId) {
        setActivePostId(null);
        return;
      }

      const token = localStorage.getItem('token');
      const res = await axios.get(`/post/${postId}/comment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments((prevComments) => ({ ...prevComments, [postId]: res.data }));
      setActivePostId(postId);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };


  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/post/${postId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setComments((prevComments) => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), response.data]
      }));

      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    else if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
    else if (seconds < 86400) return `${Math.floor(seconds / 3600)} h `;
    else return `${Math.floor(seconds / 86400)} days`;
  };

  useEffect(() => {
    
    const fetchStories = async () => {
      try {
        const response = await axios.get('/stories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStories(response.data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  const handleStoryClick = (story) => {
    setViewedStory(story);
  };


  
  const closeStoryView = () => {
    setViewedStory(null);
  };

  return (

    <div className="feed-container">
     <StoryList stories={stories} onStoryClick={handleStoryClick} />
     
      {viewedStory && (
        <StoryViewModal story={viewedStory} onClose={closeStoryView} />
      )}


      {posts.map((post) => (
        <div key={post._id} className="post">
          <div className="post-header">
            <Link to={`/user-profile/${post.user._id}`} className="profile-image-wrapper">
              <img
                src={post.user.profileImage}
                alt={`${post.user.username}'s profile`}
                className="user-profile-image"
              />
            </Link>
            <div className="post-user-info">
              <p className="username">{post.user.username}</p>
              <p className="timestamp">{formatTimeAgo(post.createdAt)}</p>
            </div>
          </div>
          <img src={post.imageUrl} alt="post" className="post-image" />
          <div className="post-info">
            <p>{post.caption}</p>
            <div className="post-actions">
            <FontAwesomeIcon
                icon={faHeart}
                style={{
                  color: post.likedByUser ? 'red' : 'white', 
                  cursor: 'pointer' 
                }}
                onClick={() => toggleLike(post._id)}
              />
              <span>{post.likes.length} Likes</span>


              <FontAwesomeIcon
                className='com-icon'
                icon={faComment}
                onClick={() => fetchComments(post._id)}
              />

              <FontAwesomeIcon icon={faShare} />
            </div>
          </div>


          {activePostId === post._id && (
            <div className="comments-section">
              <h4>Comments</h4>
              <ul>
                {(comments[post._id] || []).map((comment) => (
                  <li key={comment._id} className="comment-item">

                    <img
                      src={comment.user.profileImage}
                      alt={`${comment.user.username}'s profile`}
                      className="comment-profile-image"
                    />
                    <div className="comment-content">
                      <p>{comment.user.username} : {comment.text}</p>
                    </div>
                  </li>
                ))}
              </ul>


              <form onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(post._id);
              }} className='comment-inupt'>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment"
                  className='comment-inuptbox'
                />
                <button type="submit" className='comment-button'>Post</button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;
 