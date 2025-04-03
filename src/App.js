import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import HomePage from "./pages/homePage";
import SignupPage from "./pages/Signin";
import LoginPage from "./pages/Login";
import ViewProfile from './pages/viewprofile';

// Client imports
import ClientLayout from "./client/layout/ClientLayout";
import ClientDashboard from './client/pages/ClientDashboard';
import Explore from './client/pages/explore';
import MyVacancy from './client/pages/MyVacancy';
import Messaging from './client/pages/messenging';
import Contracts from './client/pages/contracts';
import ContractView from "./client/pages/ContractView";
import ClientProjectView from "./client/pages/projectview";
import SearchEngineer from './client/pages/search_engineer';

// Engineer imports
import EngineerLayout from "./Engineer/layout/EngineerLayout";
import EngineerDashboard from './Engineer/pages/Engineer_dashboard';
import Projects from './Engineer/pages/projects';
import EngMessaging from './Engineer/pages/Eng_messenging';
import EngContracts from './Engineer/pages/EngContracts';
import Reviews from './Engineer/pages/reviews';
import Profile from './Engineer/pages/profile';
import Support from './Engineer/pages/support';
import EditProfile from './Engineer/pages/editprofile';
import ProjectView from './Engineer/pages/projectview';

// Admin imports
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import AdminProjects from "./admin/pages/Projects";
import AdminContracts from "./admin/pages/Contracts";
import AdminReviews from "./admin/pages/Reviews";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="contracts" element={<AdminContracts />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="my-vacancy" element={<MyVacancy />} />
          <Route path="messages" element={<Messaging />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/:id" element={<ContractView />} />
          <Route path="project/:id" element={<ClientProjectView />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
          <Route path="search-engineers" element={<SearchEngineer />} />
        </Route>

        {/* Engineer Routes */}
        <Route path="/engineer" element={<EngineerLayout />}>
          <Route index element={<EngineerDashboard />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="messages" element={<EngMessaging />} />
          <Route path="contracts" element={<EngContracts />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="project/:id" element={<ProjectView />} />
          <Route path="view-profile/:id" element={<ViewProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;