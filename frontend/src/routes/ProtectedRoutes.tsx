import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/client";

function ProtectedRoutes({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    api.get("/users/me")
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoutes;
