import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useLogout = () => {
  const { setAuthUser, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLogout = async () => {
    try {
      await toast.promise(
        axiosInstance.post(
          "/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies.get("access_token")}`,
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil Logout",
          error: "Gagal logout",
        }
      );
      cookies.remove("access_token");
      setIsLoggedIn(false);
      setAuthUser(null);
      navigate("/login");
    } catch (error) {}
  };

  return { handleLogout };
};
