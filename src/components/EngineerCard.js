import React from 'react';
import { MessageSquare, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EngineerCard = ({ engineer, userType }) => {
  const navigate = useNavigate();
  const currentUserRole = JSON.parse(localStorage.getItem('user'))?.role;
  
  const handleMessageClick = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/messages',
        {
          receiver_id: engineer._id,
          content: "Can we have a conversation?"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Navigate based on user role
      const basePath = currentUserRole === 'engineer' ? '/engineer' : '/client';
      navigate(`${basePath}/messages`, { 
        state: { 
          selectedUser: {
            _id: engineer._id,
            name: `${engineer.F_name} ${engineer.L_name}`,
            profileImage: engineer.profileImage
          }
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleViewProfile = () => {
    const basePath = currentUserRole === 'engineer' ? '/engineer' : '/client';
    navigate(`${basePath}/view-profile/${engineer._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {engineer.profileImage?.url ? (
              <img 
                src={engineer.profileImage.url} 
                alt={`${engineer.F_name}'s profile`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-purple-600">
                  {engineer.F_name[0]}
                </span>
              </div>
            )}
            <CheckCircle className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full" size={16} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{`${engineer.F_name} ${engineer.L_name}`}</h2>
            <p className="text-gray-600">{engineer.title || (userType === 'engineer' ? "Civil Engineer" : "Client")}</p>
            <p className="text-gray-500 text-sm">{engineer.G_mail}</p>
          </div>
        </div>
      </div>

      {engineer.skills && userType === 'engineer' && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(engineer.skills) ? 
              engineer.skills.map((skill, index) => (
                <span 
                  key={`${engineer._id}-skill-${index}`}
                  className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs"
                >
                  {skill}
                </span>
              )) : 
              typeof engineer.skills === 'string' &&
              engineer.skills.split(',').map((skill, index) => (
                <span 
                  key={`${engineer._id}-skill-${index}`}
                  className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs"
                >
                  {skill.trim()}
                </span>
              ))
            }
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleViewProfile}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition-colors"
        >
          View Profile
        </button>
        <button 
          onClick={handleMessageClick}
          className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <MessageSquare size={18} />
          Message
        </button>
      </div>
    </div>
  );
};

export default EngineerCard;