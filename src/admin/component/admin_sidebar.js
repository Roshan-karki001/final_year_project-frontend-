import { Link, useLocation } from "react-router-dom";
// Update the import to include the correct icon
import { 
    LayoutDashboard, 
    Users, 
    FolderKanban, 
    FileText, // Changed from FileContract to FileText
    Star, 
    HelpCircle, 
    LogOut 
} from "lucide-react";

// Update the menu items array
const mainMenuItems = [
    { title: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { title: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { title: "Projects", path: "/admin/projects", icon: <FolderKanban size={20} /> },
    { title: "Contracts", path: "/admin/contracts", icon: <FileText size={20} /> }, // Changed icon here
    { title: "Reviews", path: "/admin/reviews", icon: <Star size={20} /> }
];

const AdminSidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-slate-800 text-white p-4 shadow-lg flex flex-col justify-between">
      <div>
        <h1 className="text-blue-400 text-2xl font-bold mb-8">Admin Panel</h1>
        
        {/* Admin Profile Section */}
        <div className="mb-8 p-3 rounded-lg bg-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium">Administrator</p>
              <p className="text-xs text-gray-400">{user.G_mail}</p>
            </div>
          </div>
        </div>

        <ul>
          {mainMenuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link 
                to={item.path} 
                className={`flex items-center gap-2 p-3 rounded transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-slate-700'
                  }`}
              >
                {item.icon} {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        <ul>
          <li className="mb-2">
            <Link 
              to="/admin/support"
              className={`flex items-center gap-2 p-3 rounded transition-colors
                ${location.pathname === '/admin/support'
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-slate-700'
                }`}
            >
              <HelpCircle size={20} /> Support
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 rounded transition-colors w-full hover:bg-red-500 text-red-400 hover:text-white"
            >
              <LogOut size={20} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
