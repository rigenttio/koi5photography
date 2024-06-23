import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "./context/AdminAuthContext";

const ProtectedRouteAdmin = () => {
  const { isLoggedIn } = useAdminAuth();

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRouteAdmin;
