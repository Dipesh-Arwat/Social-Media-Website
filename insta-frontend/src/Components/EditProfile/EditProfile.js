import React, { useState, useCallback, useEffect } from 'react';
import axios from '../../axios';
import './EditProfile.css';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = ({ user }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setProfileImage(fileUrl);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(profileImage, croppedAreaPixels);
      setCroppedImage(croppedImage);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }, [profileImage, croppedAreaPixels]);

  useEffect(() => {
    if (profileImage && croppedAreaPixels) {
      handleCropImage();
    }
  }, [profileImage, croppedAreaPixels, handleCropImage]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!username.trim() || !bio.trim()) {
      toast.error('Username and Bio are required.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);

    if (croppedImage) {
      const blob = await fetch(croppedImage).then((res) => res.blob());
      formData.append('profileImage', blob);
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('/user/edit', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || 'Error updating profile');
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-form" onSubmit={handleUpdate}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {profileImage && (
          <div className="crop-container">
            <Cropper
              image={profileImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {croppedImage && (
          <div className="cropped-image-preview">
            <img src={croppedImage} alt="Cropped Preview" />
          </div>
        )}

        <button type="submit">Update Profile</button>
      </form>

      <ToastContainer className="toast-container" />
    </div>
  );
};

export default EditProfile;
