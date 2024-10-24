import React, { useEffect } from 'react'; 
import axios from '../../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import './StoryViewModal.css';

const StoryViewModal = ({ story, onClose }) => {
  useEffect(() => {
    // Mark the story as viewed
    const markAsViewed = async () => {
      await axios.post(`/stories/${story._id}/view`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    };
    markAsViewed();

    // Close the modal after 5 seconds
    const closeTimer = setTimeout(() => {
      onClose();  // Close the modal automatically after 5s
    }, 10000);

    // Cleanup timer when component unmounts or if modal is closed
    return () => clearTimeout(closeTimer);

  }, [story, onClose]);

  return (
    <div className="story-view-modal" onClick={onClose}>
      <div className="story-progress-bar"></div>
      <div className="story-content" onClick={(e) => e.stopPropagation()}>
        {story.type === 'image' ? (
          <img src={story.mediaUrl} alt="Story" className="story-modal-image" />
        ) : (
          <video className="story-modal-video" controls>
            <source src={story.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
        <button className="close-button" onClick={onClose}><FontAwesomeIcon icon={faXmark}/></button>
    </div>
  );
};

export default StoryViewModal;
