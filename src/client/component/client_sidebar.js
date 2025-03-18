import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientSidebar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'client') {
      navigate('/login');
      return;
    }
    setUserData(user);
  }, [navigate]);

  const menuItems = [
    { title: 'Dashboard', path: '/client/pages/client_dashboard' },
    { title: 'Explore', path: '/client/pages/explore' },
    { title: 'My Ideas', path: '/client/pages/my-ideas' },
    { title: 'Messages', path: '/client/pages/messages' },
    { title: 'Contracts', path: '/client/pages/contracts' },
    { title: 'Pals', path: '/client/pages/pals' },
    { title: 'Support', path: '/client/pages/support' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg p-6">
      <h1 className="text-purple-700 text-2xl font-bold mb-8">EngiBridge</h1>
      
      {/* User Info */}
      {/* {userData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold">{userData.name}</p>
          <p className="text-sm text-gray-600">{userData.G_mail}</p>
          <p className="text-xs text-gray-500">ID: {userData.client_id}</p>
        </div>
      )} */}

      <nav>
        <ul className="space-y-4">
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </li>
          ))}
          <li 
            className="p-3 rounded-lg hover:bg-red-100 text-red-600 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ClientSidebar;