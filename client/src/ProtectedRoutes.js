import { Outlet, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    fetch("/api/user")
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
