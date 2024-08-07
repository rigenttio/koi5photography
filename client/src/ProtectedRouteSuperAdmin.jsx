import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "./context/AdminAuthContext";

const ProtectedRouteSuperAdmin = () => {
  const { isLoggedIn, authUser } = useAdminAuth();

  return isLoggedIn && authUser.role === "super admin" ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRouteSuperAdmin;
