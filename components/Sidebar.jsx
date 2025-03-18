import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { title: 'Dashboard', icon: '🏠', path: '/' },
    { title: 'Explore', icon: '🔍', path: '/explore' },
    { title: 'My Ideas', icon: '💡', path: '/my-ideas' },
    { title: 'Messages', icon: '✉️', path: '/messages' },
    { title: 'Contacts', icon: '👥', path: '/contacts' },
    { title: 'Pals', icon: '🤝', path: '/pals' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-purple-600 text-2xl font-bold">EngiBridge</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-8 w-full">
        <Link
          to="/support"
          className="flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50"
        >
          <span className="mr-3">❓</span>
          <span>Support</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;