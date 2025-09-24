import React from "react";
import { useNavigate } from "react-router-dom";

const ClientHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="sticky top-0 flex justify-between items-center w-full px-[25px] py-[25px] bg-white shadow-md z-10">
      <h2 className="text-lg font-semibold">Hi {user?.F_name || 'User'}</h2>
      <button
        onClick={() => navigate("/client/my-vacancy")}
        className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
      >
        + New Idea
      </button>
    </header>
  );
};

export default ClientHeader;
