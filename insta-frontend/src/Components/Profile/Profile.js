import React, { useState, useEffect } from 'react';
// import axios from '../../axios';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
import EditProfile from '../EditProfile/EditProfile';
import AddStory from '../AddStory/AddStory';
// import StoryList from '../StoryList/StoryList';

const Profile = ({ currentUser }) => {
  const [user, setUser] = useState(currentUser || {});
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  // const [stories, setStories] = useState([]);
  // const [hasStories, setHasStories] = useState(false);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false); // State for Add Story Modal

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser && currentUser._id) {
          const res = await axios.get(`https://social-media-website-backend-0xnf.onrender.com/api/user/${currentUser._id}`);
          setUser(res.data);
          setPosts(res.data.posts || []);

          // const userStories = res.data.stories || [];
          // const filteredStories = userStories.filter(story => story.userId === currentUser._id);
          // setStories(filteredStories);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [currentUser]);

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`https://social-media-website-backend-0xnf.onrender.com/api/user/${currentUser._id}/followers`);
      setFollowers(res.data || []);
      setShowFollowers(true); // Show the modal when the data is ready
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(`https://social-media-website-backend-0xnf.onrender.com/api/user/${currentUser._id}/following`);
      setFollowing(res.data || []);
      setShowFollowing(true); // Show the modal when the data is ready
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const closeModal = () => {
    setShowFollowers(false);
    setShowFollowing(false);
    setShowAddStoryModal(false); // Close the Add Story modal
  };

  const handleAddStoryClick = () => {
    setShowAddStoryModal(true); // Open the Add Story modal
  };

  // useEffect(() => {
  //   const fetchStories = async () => {
  //     try {
  //       const response = await axios.get(`/stories`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });
  //       setStories(response.data);
  //     } catch (error) {
  //       console.error('Error fetching stories:', error);
  //     }
  //   };

  //   fetchStories();
  // }, []);



  return (
    <div className="profile-container">
      {isEditing ? (
        <EditProfile user={user} />
      ) : (
        <>
          <div className="profile-info">
            <div className='profile-info-contain'>

              {user.profileImage ? (
                <img className="profile-image" src={user.profileImage} alt="profile" />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} className="default-profile-icon" size="8x" />
              )}

              <div className="profile-info-detail">
                <h2>{user.username}</h2>
                <p className="bio">{user.bio}</p>
                <div className="stats">
                  <span>{posts?.length || 0} posts</span>
                  <span onClick={fetchFollowers} className="clickable">
                    {user?.followers?.length || 0} followers
                  </span>
                  <span onClick={fetchFollowing} className="clickable">
                    {user?.following?.length || 0} following
                  </span>
                </div>


              </div>

            </div>

            <div className='btn-group'>

              <button onClick={handleEditClick} className="edit-profile-button">
                Edit Profile
              </button>
              <button onClick={handleAddStoryClick} className="add-story-button">
                Add Story
              </button>

            </div>
          </div>

          {/* {stories.length > 0 ? (
            <StoryList stories={stories} />
          ) : (
            <div className="no-stories-message">
              <p>This user has not uploaded any stories yet.</p>
            </div>
          )} */}

          {/* Followers Modal */}
          {showFollowers && (
            <div className="modal">
              <div className="modal-content">
                <FontAwesomeIcon
                  icon={faXmark}
                  className="close-modal"
                  onClick={closeModal}
                />
                <h3>Followers</h3>
                <ul>
                  {followers.length > 0 ? (
                    followers.map((follower) => (
                      <li key={follower._id} className="follower-item">
                        <img src={follower.profileImage} alt={`${follower.username}'s profile`} className="follower-image" />
                        {follower.username}
                      </li>
                    ))
                  ) : (
                    <p>No followers found.</p>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Following Modal */}
          {showFollowing && (
            <div className="modal">
              <div className="modal-content">
                <FontAwesomeIcon
                  icon={faXmark}
                  className="close-modal"
                  onClick={closeModal}
                />
                <h3>Following</h3>
                <ul>
                  {following.length > 0 ? (
                    following.map((follow) => (
                      <li key={follow._id} className="following-item">
                        <img src={follow.profileImage} alt={`${follow.username}'s profile`} className="follower-image" />
                        {follow.username}
                      </li>
                    ))
                  ) : (
                    <p>Not following anyone.</p>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Add Story Modal */}
          {showAddStoryModal && (
            <div className="modal">
              <div className="add-story-modal">
                <div className="add-story-modal-content">
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="close-modal"
                    onClick={closeModal}
                  />
                  <AddStory />
                </div>
              </div>
            </div>
          )}

          <div className="profile-posts">
            {posts.length > 0 ? (
              posts.map((post) =>
                post.imageUrl ? (
                  <img key={post._id} src={post.imageUrl} alt="post" />
                ) : (
                  <p key={post._id}>Image not available</p>
                )
              )
            ) : (
              <div className='p-center'>
              <p>No posts available</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
