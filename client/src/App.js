import react, { useState, useEffect } from "react";
import Signup from "./pages/Signup.js";
import Home from "./pages/Home.js";
import Login from "./pages/login.js";
import MyPlan from "./pages/myPlan.js";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myPlan" element={<MyPlan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
