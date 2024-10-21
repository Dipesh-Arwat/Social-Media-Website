import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from '../../axios';
import './UserProfile.css';
import '../Profile/Profile.css';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/user/${userId}`);
                setUser(response.data);
                setLoading(false);
                setIsFollowing(response.data.followers.includes(currentUserId));

                setUserPosts(response.data.posts || []);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, currentUserId]);

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/user/follow', { userId }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setIsFollowing(!isFollowing);
            setUser((prevUser) => ({
                ...prevUser,
                followersCount: isFollowing ? prevUser.followersCount - 1 : prevUser.followersCount + 1,
            }));
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>User not found</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-info">
                <div className='profile-info-contain'>
                    {user.profileImage ? (
                        <img src={user.profileImage} alt="profile" />
                    ) : (
                        <FontAwesomeIcon icon={faUserCircle} className="default-profile-icon" size="8x" />
                    )}

                    <div className='profile-info-detail'>
                        <h2>{user.username}</h2>
                        <p className="bio">{user.bio}</p>
                        <div className="stats">
                            <span>{user.posts.length} posts</span>
                            <span>{user.followers.length || 0} followers</span>
                            <span>{user.following.length || 0} following</span>
                        </div>
                    </div>
                    
                </div>
                <div className='btn-group-other'>
                        <button onClick={handleFollow} className="follow-button">
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>


            </div>
            {/* Display User Posts */}
            <div className="other-user-posts">
                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post._id} className="other-post">
                            <img src={post.imageUrl} alt={post.caption} />
                            <p>{post.caption}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
