import React, { useState } from 'react'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import axios from '../../axios';
import './UploadPost.css';

const UploadPost = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  const [caption, setCaption] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); 
  };

  const handlePostUpload = async (e) => {
    e.preventDefault();
    
    // Create FormData object for image and caption
    const formData = new FormData();
    formData.append('imageUrl', image); // 'imageUrl' should match the field in your backend
    formData.append('caption', caption);

    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

      await axios.post('/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      

      // Handle success (e.g., clear form, show a success message)
      toast.success('Post uploaded successfully!');
      setImage(null);
      setImagePreview(null); // Clear the image preview
      setCaption('');

      setTimeout(() => {
        window.location.reload(); // Refresh the page
      }, 2000); 
    } catch (error) {
      console.error(error);
      // Handle errors (e.g., show error message)
      toast.error('Error uploading post');
    }
  };
 
  
  return (
    <div className="upload-post-container">
      <h1>Upload Post</h1>
      <form onSubmit={handlePostUpload}>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Selected" />
          </div>
        )}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
        ></textarea>
        <button type="submit">Upload Post</button>
      </form>

      <ToastContainer className="toast-container" />

    </div>
  );
};

export default UploadPost;
