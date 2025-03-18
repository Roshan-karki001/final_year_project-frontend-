import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientSidebar from '../component/client_sidebar';
import ClientHeader from '../component/client_header';
import ClientContainer from '../component/client_contain';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Try to get user data from location state first, then localStorage
    const user = location.state?.userData || JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.role !== 'client') {
      navigate('/login');
      return;
    }
    
    setUserData(user);
  }, [navigate, location]);

  if (!userData) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <ClientSidebar />
      
      <div className="flex-1 flex flex-col">
        <ClientHeader />
        
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Welcome, {userData.name}</h1>
          <ClientContainer />
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
