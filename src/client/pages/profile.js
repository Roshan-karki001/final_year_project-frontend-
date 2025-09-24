import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Briefcase, Edit, MapPin, Camera, X } from "lucide-react";

const ClientProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showImageMenu, setShowImageMenu] = useState(false);

  // Add this useEffect to handle clicking outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showImageMenu) {
        setShowImageMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showImageMenu]);

  // Add stopPropagation to prevent menu from closing when clicking inside
  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowImageMenu(!showImageMenu);
  };

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

  // const handleDelete = async () => {
  //   if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

  //   try {
  //     const response = await fetch('http://localhost:5000/api/auth/delete-account', {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       localStorage.clear();
  //       navigate('/login');
  //     } else {
  //       alert(data.message || 'Failed to delete account');
  //     }
  //   } catch (error) {
  //     console.error('Delete account error:', error);
  //     alert(error.message || 'Failed to delete account. Please try again.');
  //   }
  // };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Main Profile Content */}
        <div>
          {/* Updated Profile Image Section */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 group">
              <div 
                className="relative cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={profile.profileImage?.url || "https://zultimate.com/wp-content/uploads/2019/12/default-profile.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white p-2 rounded-full">
                    <Camera size={20} className="text-gray-700" />
                  </div>
                </div>
              </div>
              
              {/* Image Menu Popup */}
              {showImageMenu && (
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 w-40 z-10">
                  <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <Camera size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">Upload Photo</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        handleImageUpload(e);
                        setShowImageMenu(false);
                      }}
                    />
                  </label>
                  {profile.profileImage?.url && (
                    <button
                      onClick={() => {
                        handleDeleteImage();
                        setShowImageMenu(false);
                      }}
                      className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 rounded text-left"
                    >
                      <X size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">Remove Photo</span>
                    </button>
                  )}
                </div>
              )}
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
                  onClick={() => navigate('/client/edit-profile')} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Edit size={16} /> Edit profile 
                </button>
                {/* <button 
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                >
                  <Trash2 size={16} /> Delete
                </button> */}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
            <p className="text-gray-600 mt-2">{profile.bio || "No bio available."}</p>
          </div>

          {/* Skills Section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {profile.skills?.length > 0 ? profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              )) : <p>No skills added.</p>}
            </ul>
          </div>

          {/* Experience Section */}
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

          {/* Portfolio Section */}
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

        {/* Right Column - Stats and Reviews */}
        <div className="space-y-6">
          {/* Projects Stats */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-blue-600">{profile.totalProjects || 0}</p>
                <p className="text-gray-600">Total Projects</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-green-600">{profile.completedProjects || 0}</p>
                <p className="text-gray-600">Completed</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-yellow-600">{profile.ongoingProjects || 0}</p>
                <p className="text-gray-600">In Progress</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-purple-600">{profile.satisfactionRate || "0%"}</p>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Client Reviews</h2>
            <div className="space-y-4">
              {profile.reviews?.length > 0 ? (
                profile.reviews.map((review, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{review.clientName}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < (review.rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    <p className="text-gray-400 text-xs mt-2">{review.date}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 py-4">
                  No reviews yet
                </div>
              )}
            </div>
            {profile.reviews?.length > 3 && (
              <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
