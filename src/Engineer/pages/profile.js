import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, Briefcase, Edit, Trash2, MapPin } from "lucide-react";

const EngineerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        navigate('/login');
        return;
    }

    fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Failed to fetch profile');
        }
        return res.json();
    })
    .then(data => {
        if (data.success) {
            setProfile(data.user);
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (error.message.includes('token')) {
            localStorage.clear();
            navigate('/login');
        }
    });
}, [navigate]);

  const handleEdit = () => {
    navigate('/engineer/profile/edit', { 
      state: { 
        profileData: profile
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      fetch(`http://localhost:5000/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            localStorage.clear();
            navigate('/login');
          } else {
            alert(data.message || 'Failed to delete account');
          }
        })
        .catch((err) => {
          console.error('Error deleting account:', err);
          alert(err.message || 'Failed to delete account. Please try again.');
        });
    }
  };

  if (!profile) return (
    <div className="flex justify-center items-center h-full">
      <p className="text-gray-600">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{profile.F_name} {profile.L_name}</h1>
        <div className="flex gap-2">
          <button onClick={handleEdit} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
            <Edit size={16} /> Edit
          </button>
          <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
      <p className="text-gray-600">Engineer</p>
      <div className="flex gap-4 mt-3">
        <p className="flex items-center gap-1 text-gray-500"><MapPin size={16} /> {profile.location || "Not Provided"}</p>
        <p className="flex items-center gap-1 text-gray-500"><Mail size={16} /> {profile.G_mail}</p>
        <p className="flex items-center gap-1 text-gray-500"><Phone size={16} /> {profile.Phonenumber}</p>
      </div>
      <p className="mt-4 text-gray-700">{profile.bio || "No bio available."}</p>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Skills</h2>
        <ul className="list-disc list-inside text-gray-600">
          {profile.skills?.length > 0 ? profile.skills.map((skill, index) => <li key={index}>{skill}</li>) : <p>No skills added.</p>}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Experience</h2>
        {profile.experience?.length > 0 ? (
          <ul className="text-gray-600">
            {profile.experience.map((exp, index) => (
              <li key={index} className="flex gap-2 items-center">
                <Briefcase size={16} /> {exp.title} at {exp.company} ({exp.years} years)
              </li>
            ))}
          </ul>
        ) : <p>No experience added.</p>}
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Portfolio</h2>
        {profile.portfolio?.length > 0 ? (
          <ul className="text-blue-600">
            {profile.portfolio.map((link, index) => (
              <li key={index}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>
            ))}
          </ul>
        ) : <p>No portfolio added.</p>}
      </div>
    </div>
  );
};

export default EngineerProfile;
