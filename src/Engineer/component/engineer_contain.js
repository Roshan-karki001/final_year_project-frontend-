import React from 'react';
import { useLocation } from 'react-router-dom';
import Projects from '../pages/projects';
import Messaging from '../pages/Eng_messenging';
import Contracts from '../pages/contracts';
import Reviews from '../pages/reviews';
import Profile from '../pages/profile';
import Support from '../pages/support';
import EngineerDashboard from '../pages/Engineer_dashboard';

const EngineerContainer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    switch (currentPath) {
      case '/engineer':
      case '/engineer/dashboard':
        return <EngineerDashboard />;
      case '/engineer/projects':
        return <Projects />;
      case '/engineer/messages':
        return <Messaging />;
      case '/engineer/contracts':
        return <Contracts />;
      case '/engineer/reviews':
        return <Reviews />;
      case '/engineer/profile':
        return <Profile />;
      case '/engineer/support':
        return <Support />;
      default:
        return <EngineerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pt-16 px-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default EngineerContainer;
