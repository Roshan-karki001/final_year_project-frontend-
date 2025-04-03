import React from "react";
import { Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="sticky top-0 flex justify-between items-center w-full px-8 py-4 bg-white shadow-md z-10">
      <h2 className="text-xl font-semibold">Welcome, Admin</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
