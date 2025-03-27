import React from 'react';
import { useLocation } from 'react-router-dom';
import ExplorePage from '../pages/explore';
import Messaging from '../pages/messenging';
import MyVacancy from '../pages/MyVacancy';
import ClientDashboard from '../pages/ClientDashboard';
import Contracts from '../pages/contracts';  // Add this import

const ClientContainer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    switch (currentPath) {
      case '/client':
      case '/client/dashboard':
        return <ClientDashboard />;
      case '/client/explore':
        return <ExplorePage />;
      case '/client/my-vacancy':
        return <MyVacancy />;
      case '/client/messages':
        return <Messaging />;
      case '/client/contracts':
        return <Contracts />;  // Replace the placeholder with actual component
      case '/client/pals':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Pals</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pals cards will go here */}
            </div>
          </div>
        );
      case '/client/support':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Support</h1>
            {/* Support content will go here */}
          </div>
        );
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="pt-60 px-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default ClientContainer;
