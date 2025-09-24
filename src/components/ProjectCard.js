import React, { useState } from 'react';
import { Calendar, DollarSign, Home, Maximize } from "lucide-react";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleViewDetails = (projectId) => {
    navigate(`/client/project/${projectId}`);
  };

  const [showOwnProjectAlert, setShowOwnProjectAlert] = useState(false);

  const handleContactOwner = () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    const loggedInUserId = user.id;
   
    if (loggedInUserId && loggedInUserId.toString() === project.userId._id.toString()) {
      setShowOwnProjectAlert(true);
    } else {
      navigate(`/client/view-profile/${project.userId._id}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
            {project.userImage ? (
              <img 
                src={project.userImage} 
                alt={project.userName} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-purple-700" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{project.title}</h3>
            <p className="text-sm text-gray-600">Posted by: {project.userName}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
          project.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
          project.status === "completed" ? "bg-green-100 text-green-800" : 
          "bg-blue-100 text-blue-800"
        }`}>
          {project.status}
        </span>
      </div>
      <div className="flex justify-between items-start">
        
        
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Maximize className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">{project.landArea} sq.ft</span>
        </div>
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700 capitalize">{project.buildingType}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">${project.budget.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">{project.timeline}</span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => handleViewDetails(project._id)}
        >
          View Details
        </button>
        <button
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          onClick={handleContactOwner}
        >
          Contact Owner
        </button>
      </div>

      {/* Alert Modal */}
      {showOwnProjectAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm transition-all duration-300">
          <div className="relative w-full max-w-md transform scale-100 transition-transform duration-300 ease-out">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">
              {/* Icon and Title */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Project</h3>
                <p className="text-gray-600">
                  This is your own project. You already have full access to manage this project.
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => setShowOwnProjectAlert(false)}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl 
                hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] 
                transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      F_name: PropTypes.string.isRequired,
      L_name: PropTypes.string.isRequired,
      G_mail: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    landArea: PropTypes.number.isRequired,
    buildingType: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    timeline: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

// Make sure the export is correct
export default ProjectCard;