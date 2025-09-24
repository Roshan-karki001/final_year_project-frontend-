import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../component/admin_sidebar';
import AdminHeader from '../component/admin_header';

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 fixed h-full z-20">
        <AdminSidebar />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="h-16 fixed top-0 left-64 right-0 z-10 bg-white shadow">
          <AdminHeader />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 mt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
