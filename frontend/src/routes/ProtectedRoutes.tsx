import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Loading from "../components/Loading";

function ProtectedRoutes({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get("/users/me")
      .then(response => {
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return isAuthenticated ? children : null;
}

export default ProtectedRoutes;