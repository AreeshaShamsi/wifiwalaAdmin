import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./pages/Home.jsx";
import PlansPage from "./pages/Plans.jsx";
import Offer from "./pages/Offers.jsx";
import AdminLogin from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Complaint from "./pages/Complaint.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          }
        />

         <Route
          path="/complain"
          element={
            <ProtectedRoute>
              <Complaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/offer"
          element={
            <ProtectedRoute>
              <Offer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
