import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


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
      </div>
    </header>
  );
};

export default EngineerHeader;