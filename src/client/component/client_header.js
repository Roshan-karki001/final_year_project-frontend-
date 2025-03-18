import React from 'react';
import { Link } from 'react-router-dom';

const ClientHeader = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="flex-1"></div>
      <button className="bg-purple-600 text-white px-4 py-2 rounded-full">New Idea</button>
    </header>
  );
};

export default ClientHeader;