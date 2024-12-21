import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/homePage";
import SignupPage from "../src/pages/signin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignupPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
