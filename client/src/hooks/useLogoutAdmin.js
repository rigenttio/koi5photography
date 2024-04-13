import React from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useLogoutAdmin = () => {
  const { setAuthUser, setIsLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLogoutAdmin = async () => {
    try {
      await toast.promise(
        axiosInstance.post(
          "/admin/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies.get("access_token_admin")}`,
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil Logout",
          error: "Gagal logout",
        }
      );
      cookies.remove("access_token_admin");
      setIsLoggedIn(false);
      setAuthUser(null);
      navigate("/admin/login");
    } catch (error) {}
  };

  return { handleLogoutAdmin };
};
