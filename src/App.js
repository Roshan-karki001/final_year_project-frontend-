import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';

// Public pages
import HomePage from "./pages/homePage";
import SignupPage from "./pages/Signin";
import LoginPage from "./pages/Login";
import VerifyEmail from "./pages/verifyemail";  // Updated to match the actual filename case


// Client imports
import ClientLayout from "./client/layout/ClientLayout";
import ClientDashboard from './client/pages/ClientDashboard';
import Explore from './client/pages/explore';
import MyVacancy from './client/pages/MyVacancy';
import Messaging from './client/pages/messenging';
import Contracts from './client/pages/contracts';
import ContractView from "../src/components/ContractView";
import ClientProjectView from "./client/pages/projectview";
import SearchEngineer from './client/pages/search_engineer';
import MyProject from './client/pages/myproject';
import ClientProfile from './client/pages/profile';
import ClientEditProfile from './client/pages/editprofile';
import ClientSecuritySettings from './client/pages/Security'; 
import ViewProfile from './components/viewprofile';

// Engineer imports
import EngineerLayout from "./Engineer/layout/EngineerLayout";
import EngineerDashboard from './Engineer/pages/Engineer_dashboard';
import Projects from './Engineer/pages/projects';

import EngContracts from './Engineer/pages/EngContracts';
import Reviews from './Engineer/pages/reviews';
import Profile from './Engineer/pages/profile';
import Support from './Engineer/pages/support';
import EditProfile from './Engineer/pages/editprofile';
import ProjectView from './Engineer/pages/projectview';
import AdminProjectView from './admin/pages/AdminProjectView';



// Admin imports
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import AdminProjects from "./admin/pages/Projects";
import AdminContracts from "./admin/pages/Admincontract";
import AdminContractView from "./admin/pages/AdminContractView";
import AdminReviews from "./admin/pages/Reviews";
import Adminviewprofile from './admin/pages/Adminviewprofile';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add this line */}
        <Route path="/verify-email" element={<VerifyEmail />} /> {/* Add this line */}
        
        

        {/* Admin Routes Inside the Admin Routes section*/}
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="contracts" element={<AdminContracts />} />
          <Route path="contracts/view/:id" element={<AdminContractView />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="projects/:id" element={<AdminProjectView />} />
          <Route path="view-profile/:id" element={<Adminviewprofile />} /> {/* Updated this line */}
        </Route>

        {/* Client Routes */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="view-profile/:id" element={<ViewProfile />} />
          <Route path="my-vacancy" element={<MyVacancy />} />
          <Route path="myproject" element={<MyProject />} />
          <Route path="messages" element={<Messaging />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/view/:id" element={<ContractView />} />
          <Route path="project/:id" element={<ClientProjectView />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="edit-profile" element={<ClientEditProfile />} />
          <Route path="support" element={<Support />} />
          <Route path="search-engineers" element={<SearchEngineer />} />
          <Route path="security" element={<ClientSecuritySettings />} />
        </Route>

        {/* Engineer Routes */}
        <Route path="/engineer" element={<EngineerLayout />}>
          <Route index element={<EngineerDashboard />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="messages" element={<Messaging />} />
          <Route path="contracts" element={<EngContracts />} />
          <Route path="contracts/view/:id" element={<ContractView />} />
          <Route path="search-engineers" element={<SearchEngineer />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="support" element={<Support />} />
          <Route path="security" element={<ClientSecuritySettings />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="project/:id" element={<ProjectView />} />
          <Route path="view-profile/:id" element={<ViewProfile/>} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;