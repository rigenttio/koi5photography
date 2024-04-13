import React, { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useLoginAdmin = () => {
  const cookies = new Cookies();
  const { setIsLoggedIn, setAuthUser } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(axiosInstance.post("/admin/login", formData), {
        loading: "Saving...",
        success: "Berhasil login",
        error: "Gagal login",
      });
      const token = response.data.token;
      cookies.set("access_token_admin", token, { secure: true, sameSite: "strict" });

      const userResponse = await axiosInstance.get("/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuthUser(userResponse.data.data);
      setIsLoggedIn(true);
      navigate("/admin/dashboard");
    } catch (error) {}
  };

  return {
    handleLogin,
    setEmail,
    setPassword,
  };
};
