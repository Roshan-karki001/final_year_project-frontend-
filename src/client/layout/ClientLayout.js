import { React, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64">
        <ClientHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


export default ClientLayout;
