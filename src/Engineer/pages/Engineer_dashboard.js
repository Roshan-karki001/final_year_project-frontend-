import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const EngineerDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Check both user existence and role
    if (!user || user.role !== 'engineer') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Add your engineer dashboard components here */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Welcome, {user.name}</h1>
        {/* Add more engineer dashboard content */}
      </main>
    </div>
  );
};

export default EngineerDashboard;