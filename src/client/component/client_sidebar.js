import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, 
    Search,
    FolderKanban, 
    FileText, 
    MessageSquare,
    PlusCircle,
    User,
    HelpCircle, 
    LogOut,
    Bell,
    X 
} from "lucide-react";
import { useState, useRef, useEffect } from 'react';

const mainMenuItems = [
    { title: "Dashboard", path: "/client", icon: <LayoutDashboard size={20} /> },
    { title: "Explore", path: "/client/explore", icon: <Search size={20} /> },
    { title: "My Projects", path: "/client/myproject", icon: <FolderKanban size={20} /> },
    { title: "Post Vacancy", path: "/client/my-vacancy", icon: <PlusCircle size={20} /> },
    { title: "Contracts", path: "/client/contracts", icon: <FileText size={20} /> },
    { title: "Messages", path: "/client/messages", icon: <MessageSquare size={20} /> },
    { title: "Find people", path: "/client/search-engineers", icon: <Search size={20} /> },
];

const ClientSidebar = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/notification/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success && data.notifications) {
                setNotifications(data.notifications);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/notification/countnotification', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setUnreadCount(data.unreadCount);
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = async (notificationId) => {
        try {
            console.log('Attempting to mark notification as read:', notificationId);
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/notification/notifications/${notificationId}/read`, {
                method: 'PATCH',  // Changed from PATCH to PUT to match backend route
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            const responseData = await response.text();
            console.log('Response data:', responseData);

            if (response.ok) {
                setNotifications(notifications.map(notif =>
                    notif._id === notificationId ? { ...notif, read: true } : notif
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                throw new Error(`Failed to mark notification as read: ${responseData}`);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/notification/notifications/mark-all-read', {
                method: 'PUT', // Changed to PUT to match backend
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Update local state after successful backend update
                setNotifications(notifications.map(notif => ({ ...notif, read: true })));
                setUnreadCount(0);
                // Optionally refresh notifications from server
                await fetchNotifications();
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-white-100 text-black p-4 shadow-lg flex flex-col justify-between">
            <div className="flex flex-col gap-[25px]">
                <div>
                    <h1 className="text-purple-700 text-4xl font-bold mb-4">EngiBridge</h1>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-1 p-1">Main Menu</h3>
                    <ul>
                        {mainMenuItems.map((item, index) => (
                            <li key={index} className="mb-2">
                                <Link 
                                    to={item.path} 
                                    className={`flex items-center gap-1 p-1 rounded transition-colors
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
            </div>

            <div className="mt-auto">
                <ul>
                    <h3 className="text-xl font-semibold mb-1 p-1">Others</h3>
                    <li className="mb-2">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="w-full flex items-center gap-2 p-2 rounded transition-colors hover:bg-gray-300 relative"
                        >
                            <Bell size={20} /> 
                            Notifications
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div 
                                ref={notificationRef}
                                className="fixed left-60 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-lg shadow-lg z-50"
                            >
                                <div className="p-6 border-b">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-semibold">
                                            Notifications
                                            {unreadCount > 0 && (
                                                <span className="ml-2 text-sm text-red-500">
                                                    ({unreadCount} unread)
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex gap-2 items-center">
                                            {unreadCount > 0 && (
                                                <button 
                                                    onClick={handleMarkAllAsRead}
                                                    className="text-sm text-blue-500 hover:underline"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setShowNotifications(false)}
                                                className="p-1 hover:bg-gray-100 rounded-full"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[calc(800px-88px)] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div key={notification._id} 
                                                className="p-4 hover:bg-gray-50 border-b cursor-pointer"
                                                onClick={() => handleNotificationClick(notification._id)}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                                        <FileText size={20} className={!notification.read ? "text-red-600" : "text-purple-700"} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <p className="text-sm">
                                                                <span className={!notification.read ? "font-bold text-red-600" : "font-normal"}>
                                                                    {notification.userId.F_name}
                                                                </span>
                                                            </p>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(notification.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm mt-1 ${!notification.read ? "font-bold text-red-600" : "text-gray-600"}`}>
                                                            {notification.message}
                                                        </p>
                                                        <span className={`text-xs mt-1 ${!notification.read ? "text-red-600" : "text-purple-600"}`}>
                                                            {notification.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No notifications to display
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <Link to="/client/support" className="flex items-center gap-2 p-2 rounded transition-colors hover:bg-gray-300">
                            <HelpCircle size={20} /> Support
                        </Link>
                    </li>

                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 p-3 mb-2 rounded-lg hover:bg-gray-200 transition-colors w-full"
                        >
                            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                {user.profileImage?.url ? (
                                    <img 
                                        src={user.profileImage.url}
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
                        </button>

                        {showDropdown && (
                            <div className="absolute bottom-full left-0 w-48 mb-2 bg-white rounded-lg shadow-lg py-2">
                                <Link 
                                    to="/client/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <User size={16} />
                                    My Profile
                                </Link>
                                <Link 
                                    to="/client/myproject"
                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <FolderKanban size={16} />
                                    My Projects
                                </Link>
                                <Link 
                                    to="/client/security"
                                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    Security
                                </Link>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </ul>
            </div>
        </aside>
    );
};

export default ClientSidebar;
