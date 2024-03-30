import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import LoadingPulse from "../components/Fragments/Loading/LoadingPulse";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const cookies = new Cookies();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState([null]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = cookies.get("access_token");
    const getUserMe = async (token) => {
      try {
        const response = await axiosInstance.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAuthUser(response.data.data);
        setIsLoggedIn(true);
      } catch (error) {
        cookies.remove("access_token");
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
  return <AuthContext.Provider value={{ isLoggedIn, setAuthUser, setIsLoggedIn, authUser, isLoading }}>{children}</AuthContext.Provider>;
};
export { AuthContext, AuthProvider };
