import { React, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ClientSidebar from "../component/client_sidebar";
import ClientHeader from "../component/client_header";
// Removed ClientNav import

const ClientLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "client") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (Fixed) */}
      <ClientSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Fixed Header */}
        <ClientHeader />

        {/* Page Content (Scrollable) */}
        <main className="p-6 mt-16 bg-white min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
