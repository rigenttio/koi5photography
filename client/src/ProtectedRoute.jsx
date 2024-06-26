import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" state={{ prevUrl: location.pathname }} />;
};

export default ProtectedRoute;
