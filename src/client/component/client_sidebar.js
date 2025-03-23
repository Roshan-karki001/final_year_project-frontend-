import { Link, useLocation } from "react-router-dom";
import { Home, Search, Briefcase, MessageSquare, FileText, Users, HelpCircle, LogOut } from "lucide-react";

const mainMenuItems = [
  { title: "Dashboard", path: "/client", icon: <Home size={20} /> },
  { title: "Explore", path: "/client/explore", icon: <Search size={20} /> },
  { title: "Vacancy", path: "/client/my-vacancy", icon: <Briefcase size={20} /> },
  { title: "Messages", path: "/client/messages", icon: <MessageSquare size={20} /> },
  { title: "Contracts", path: "/client/contracts", icon: <FileText size={20} /> },
  { title: "Pals", path: "/client/pals", icon: <Users size={20} /> },
];

const ClientSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-100 text-black p-4 shadow-lg flex flex-col justify-between">
      <div>
        <h1 className="text-purple-700 text-2xl font-bold mb-8">EngiBridge</h1>
        <ul>
          {mainMenuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link 
                to={item.path} 
                className={`flex items-center gap-2 p-2 rounded transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-gray-200 font-semibold' 
                    : 'hover:bg-gray-300'
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
              to="/client/support"
              className={`flex items-center gap-2 p-2 rounded transition-colors
                ${location.pathname === '/client/support'
                  ? 'bg-gray-200 font-semibold' 
                  : 'hover:bg-gray-300'
                }`}
            >
              <HelpCircle size={20} /> Support
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 p-2 rounded transition-colors w-full hover:bg-gray-300 text-red-600"
            >
              <LogOut size={20} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default ClientSidebar;
