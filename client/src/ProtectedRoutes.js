import { Outlet, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      });
  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
