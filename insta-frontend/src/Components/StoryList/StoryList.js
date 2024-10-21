import React from 'react';
import './StoryList.css';

const StoryList = ({ stories, onStoryClick }) => {
    return (
        <div className="story-list">

            {stories.map((story) => (
                <div className='story-conatin'>
                    <div className='circle-border'>
                        <div key={story._id} className="story" onClick={() => onStoryClick(story)}>
                            {story.type === 'image' ? (
                                <img src={story.mediaUrl} alt="Story" className="story-media" />
                            ) : (
                                <video src={story.mediaUrl} controls className="story-media" />
                            )}
                        </div>
                    </div>


                    <p className="story-username">{story.user.username}</p>
                </div>
            ))}

        </div>
    );
};

export default StoryList;
