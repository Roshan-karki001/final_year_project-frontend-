import { NavLink } from "react-router-dom";
import { FaHome, FaProjectDiagram, FaEnvelope, FaFileContract, FaStar, FaUser, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

const EngineerSidebar = () => {
  return (
    <div className="h-full p-5">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">EngiBridge</h1>
      <nav className="space-y-2">
        <NavLink to="/engineer/dashboard" className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition">
          <FaHome className="mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/engineer/projects" className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition">
          <FaProjectDiagram className="mr-3" /> Projects
        </NavLink>
        <NavLink to="/engineer/messages" className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition">
          <FaEnvelope className="mr-3" /> Messages
        </NavLink>
        <NavLink to="/engineer/contracts" className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition">
          <FaFileContract className="mr-3" /> Contracts
        </NavLink>
        <NavLink to="/engineer/reviews" className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition">
          <FaStar className="mr-3" /> Reviews
        </NavLink>
        <NavLink to="/engineer/profile" className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition">
          <FaUser className="mr-3" /> Profile
        </NavLink>
        <NavLink to="/engineer/support" className="flex items-center p-3 rounded-lg hover:bg-purple-100 transition">
          <FaQuestionCircle className="mr-3" /> Support
        </NavLink>
        <NavLink to="/logout" className="flex items-center p-3 rounded-lg text-red-600 hover:bg-red-100 transition">
          <FaSignOutAlt className="mr-3" /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default EngineerSidebar;
