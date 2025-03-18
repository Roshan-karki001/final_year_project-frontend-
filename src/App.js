import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage";
import SignupPage from "./pages/Signin";
import LoginPage from "./pages/Login";
import VacancyForm from "./pages/VacancyForm";
import ClientDashboard from './client/pages/Client_dashboard';
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vacancy-form" element={<VacancyForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/client/pages/client_dashboard" element={<ClientDashboard />} />
        {/* Add more routes as needed */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
