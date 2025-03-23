import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/homePage";
import SignupPage from "./pages/Signin";
import LoginPage from "./pages/Login";
import ClientLayout from "./client/layout/ClientLayout";
import EngineerLayout from "./Engineer/layout/EngineerLayout";
import ClientDashboard from './client/pages/ClientDashboard';
import EngineerDashboard from './Engineer/pages/Engineer_dashboard';
import Explore from './client/pages/explore';
import Projects from './Engineer/pages/projects';
import MyVacancy from './client/pages/MyVacancy';
import Messaging from './client/pages/messenging';
import EngMessaging from './Engineer/pages/Eng_messenging';
import Contracts from './Engineer/pages/contracts';
import Reviews from './Engineer/pages/reviews';
import Profile from './Engineer/pages/profile';
import Support from './Engineer/pages/support';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Client Routes */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="my-vacancy" element={<MyVacancy />} />
          <Route path="messages" element={<Messaging />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Engineer Routes */}
        <Route path="/engineer" element={<EngineerLayout />}>
          <Route index element={<EngineerDashboard />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="messages" element={<EngMessaging />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
