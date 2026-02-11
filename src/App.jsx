import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React from "react";

import Home from "./pages/Home.jsx";
import PlansPage from "./pages/Plans.jsx";
import OperatorPlans from "./pages/OperatorPlans.jsx";
import Offer from "./pages/Offers.jsx";
import AdminLogin from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Complaint from "./pages/Complaint.jsx";
import Settings from "./pages/Settings.jsx";
import Users from "./pages/Users.jsx";
import Subscribed from "./pages/Subscribed.jsx";
import VIPoffers from "./pages/VipOffers.jsx";
import Carousel from "./pages/Carouselchange.jsx";
import Sidebar from "./components/Sidebar.jsx";

function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Hide sidebar on login page */}
      {location.pathname !== "/" && <Sidebar />}

      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
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
          path="/plans/:id"
          element={
            <ProtectedRoute>
              <OperatorPlans />
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
          path="/carousel-change"
          element={
            <ProtectedRoute>
              <Carousel />
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

        <Route
          path="/vipoffers"
          element={
            <ProtectedRoute>
              <VIPoffers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscribed"
          element={
            <ProtectedRoute>
              <Subscribed />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
