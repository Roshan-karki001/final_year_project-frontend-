import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../component/admin_sidebar';
import AdminHeader from '../component/admin_header';
import AdminContainer from '../component/admin_contain';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <AdminContainer />
      </div>
    </div>
  );
};

export default AdminLayout;