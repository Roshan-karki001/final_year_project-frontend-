import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import EngineerSidebar from "../component/engineer_sidebar";
import EngineerHeader from "../component/engineer_header";

const EngineerLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || user.role !== "engineer") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40 transition-all duration-300">
        <EngineerSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64">
        <EngineerHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EngineerLayout;