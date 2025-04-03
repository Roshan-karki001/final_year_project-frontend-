import React from 'react';
import { useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Projects from '../pages/Projects';
import Contracts from '../pages/Contracts';
import Reviews from '../pages/Reviews';

const AdminContainer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    switch (currentPath) {
      case '/admin':
      case '/admin/dashboard':
        return <Dashboard />;
      case '/admin/users':
        return <Users />;
      case '/admin/projects':
        return <Projects />;
      case '/admin/contracts':
        return <Contracts />;
      case '/admin/reviews':
        return <Reviews />;
      case '/admin/support':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Admin Support</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <p>Contact system support for assistance.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="ml-60 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminContainer;
