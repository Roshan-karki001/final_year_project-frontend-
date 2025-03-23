import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings } from 'lucide-react';

const EngineerHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="sticky top-0 flex justify-between items-center w-full px-8 py-4 bg-white shadow-md z-10">
      <h2 className="text-lg font-semibold">Welcome, {user?.F_name || 'Engineer'}</h2>
      
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/engineer/projects")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          View Projects
        </button>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell size={20} className="text-gray-600" />
          </button>
          <button 
            onClick={() => navigate("/engineer/profile")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default EngineerHeader;