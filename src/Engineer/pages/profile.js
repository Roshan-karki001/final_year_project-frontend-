import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Briefcase, Edit, Trash2, MapPin, Camera, X } from "lucide-react";

const EngineerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  // Remove unused state
  // const [selectedImage, setSelectedImage] = useState(null);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('token')) {
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      // Fix: Update the endpoint URL to match the backend route
      const response = await fetch('http://localhost:5000/api/auth/profile/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          profileImage: data.profileImage
        }));
        await fetchProfile();
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image: ' + error.message);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile image?')) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile/delete-image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          profileImage: data.user.profileImage
        }));
        // No need to call fetchProfile() as we already have the updated profileImage
      } else {
        throw new Error(data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Delete image error:', error);
      alert('Failed to delete image: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        localStorage.clear();
        navigate('/login');
      } else {
        alert(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert(error.message || 'Failed to delete account. Please try again.');
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-200">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <img
            src={profile.profileImage?.url || "https://zultimate.com/wp-content/uploads/2019/12/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <label className="cursor-pointer bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition">
              <Camera size={16} />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            {profile.profileImage?.url && (
              <button
                onClick={handleDeleteImage}
                className="bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold mt-4 text-gray-800">{profile.F_name} {profile.L_name}</h1>
        <p className="text-gray-500">{profile.role}</p>
      </div>

      {/* Profile Details */}
      <div className="mt-6 space-y-4 text-gray-700">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-gray-600"><MapPin size={16} /> {profile.location || "Not Provided"}</p>
            <p className="flex items-center gap-2 text-gray-600"><Mail size={16} /> {profile.G_mail}</p>
            <p className="flex items-center gap-2 text-gray-600"><Phone size={16} /> {profile.Phonenumber}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/engineer/profile/edit')} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Edit size={16} /> Edit
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
        <p className="text-gray-600 mt-2">{profile.bio || "No bio available."}</p>
      </div>

      {/* Rest of the sections with updated styling */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          {profile.skills?.length > 0 ? profile.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          )) : <p>No skills added.</p>}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
        <ul className="text-gray-600 mt-2">
          {profile.experience?.length > 0 ? profile.experience.map((exp, index) => (
            <li key={index} className="flex gap-2 items-center">
              <Briefcase size={16} /> {exp.title} at {exp.company} ({exp.years} years)
            </li>
          )) : <p>No experience added.</p>}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800">Portfolio</h2>
        <ul className="text-blue-600 mt-2">
          {profile.portfolio?.length > 0 ? profile.portfolio.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{link}</a>
            </li>
          )) : <p>No portfolio added.</p>}
        </ul>
      </div>
    </div>
  );
};

export default EngineerProfile;
