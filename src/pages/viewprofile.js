import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Mail, Phone, Briefcase } from 'lucide-react';

const ViewProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from URL params
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Update the URL to use the ID parameter
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
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
  }, [navigate, id]); // Add id to dependency array

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
        <div className="w-32 h-32">
          <img
            src={profile.profileImage?.url || "https://zultimate.com/wp-content/uploads/2019/12/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
          />
        </div>
        <h1 className="text-2xl font-bold mt-4 text-gray-800">{profile.F_name} {profile.L_name}</h1>
        <p className="text-gray-500">{profile.role}</p>
      </div>

      {/* Profile Details */}
      <div className="mt-6 space-y-4 text-gray-700">
        <div className="flex justify-center items-center border-b pb-3">
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-gray-600"><MapPin size={16} /> {profile.location || "Not Provided"}</p>
            <p className="flex items-center gap-2 text-gray-600"><Mail size={16} /> {profile.G_mail}</p>
            <p className="flex items-center gap-2 text-gray-600"><Phone size={16} /> {profile.Phonenumber}</p>
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
  );
};

export default ViewProfile;
