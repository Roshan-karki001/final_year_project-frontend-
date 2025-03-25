import { Link, useLocation } from "react-router-dom";
import { Home, Search, Briefcase, MessageSquare, FileText, User, HelpCircle, LogOut } from "lucide-react";

const mainMenuItems = [
  { title: "Dashboard", path: "/client", icon: <Home size={20} /> },
  { title: "Explore", path: "/client/explore", icon: <Search size={20} /> },
  { title: "Vacancy", path: "/client/my-vacancy", icon: <Briefcase size={20} /> },
  { title: "Messages", path: "/client/messages", icon: <MessageSquare size={20} /> },
  { title: "Contracts", path: "/client/contracts", icon: <FileText size={20} /> }, 
];

const ClientSidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-100 text-black p-4 shadow-lg flex flex-col justify-between">
      <div>
        <h1 className="text-purple-700 text-2xl font-bold mb-4">EngiBridge</h1>
        
        {/* Profile Section */}
        <Link 
          to="/client/profile"
          className="flex items-center gap-3 p-3 mb-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
            {user.profileImage?.url ? (
              <img 
                src={user.profileImage.url || "https://zultimate.com/wp-content/uploads/2019/12/default-profile.png"}
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-purple-700" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.F_name} {user.L_name}</p>
            <p className="text-xs text-gray-500 truncate">{user.G_mail}</p>
          </div>
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </Link>

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
