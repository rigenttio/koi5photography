import React, { Children, createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { axiosInstance } from "../lib/axios";
import LoadingPulse from "../components/Fragments/Loading/LoadingPulse";

const AdminAuthContext = createContext();
export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};

const AdminAuthProvider = ({ children }) => {
  const cookies = new Cookies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState([null]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = cookies.get("access_token_admin");
    const getUserMe = async (token) => {
      try {
        const response = await axiosInstance.get("/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAuthUser(response.data.data);
        setIsLoggedIn(true);
      } catch (error) {
        cookies.remove("access_token_admin");
        setAuthUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUserMe(token);
  }, []);

  if (isLoading) {
    return <LoadingPulse />;
  }

  return <AdminAuthContext.Provider value={{ authUser, setAuthUser, isLoggedIn, setIsLoggedIn }}>{children}</AdminAuthContext.Provider>;
};

export { AdminAuthProvider, AdminAuthContext };
