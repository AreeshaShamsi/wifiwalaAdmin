import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home.jsx";
import React from "react";
import PlansPage from "./pages/Plans.jsx";
import Offer from "./pages/Offers.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/offer" element={<Offer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
