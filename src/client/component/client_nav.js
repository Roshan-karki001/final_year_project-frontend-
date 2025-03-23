import React from 'react';
import { useLocation } from 'react-router-dom';

const ClientNav = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/client':
      case '/client/dashboard':
        return 'Dashboard';
      case '/client/explore':
        return 'Explore';
      case '/client/my-vacancy':
        return 'My Vacancy';
      case '/client/messages':
        return 'Messages';
      case '/client/contracts':
        return 'Contracts';
      case '/client/pals':
        return 'Pals';
      case '/client/support':
        return 'Support';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="flex py-4">
      <h1 className="text-2xl font-bold text-gray-800">
        {getPageTitle()}
      </h1>
    </nav>
  );
};

export default ClientNav;