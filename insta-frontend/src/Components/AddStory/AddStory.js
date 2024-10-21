import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import './AddStory.css';

const AddStory = () => {
    const [storyFile, setStoryFile] = useState(null);
    const [storyPreview, setStoryPreview] = useState(null); // New state for image preview
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setStoryFile(file);
            setStoryPreview(URL.createObjectURL(file)); // Create a preview URL
            setError(''); // Clear any previous error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!storyFile) {
            setError('Please upload a story.');
            return;
        }

        const formData = new FormData();
        formData.append('media', storyFile);
        formData.append('type', 'image');

        try {
            await axios.post('/stories/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setStoryFile(null);
            setStoryPreview(null); 

           
            toast.success('Story uploaded successfully!', {
                position: "top-center",
                autoClose: 3000,
            });

            
            setTimeout(() => {
                navigate('/profile');
                window.location.reload(); 
            }, 3000); 

        } catch (error) {
            console.error('Error uploading story:', error);
            setError('Failed to upload story.');
            
           
            toast.error('Failed to upload story.', {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="add-story">
            <h2>Add Story</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="story-form">
                <input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleFileChange} 
                    className="file-input" 
                />
                {storyPreview && (
                    <div className="preview-container">
                        <img src={storyPreview} alt="Story Preview" className="preview-image" />
                    </div>
                )}
                <button type="submit" className="upload-button">Upload Story</button>
            </form>
            <ToastContainer className="toast-container" /> 
        </div>
    );
};

export default AddStory;
