import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export const useLogin = () => {
  const cookies = new Cookies();
  const { setIsLoggedIn, setAuthUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorLimit, setErrorLimit] = useState("");
  const [attemptLeft, setAttemptLeft] = useState("");

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(axiosInstance.post("/login", formData), {
        loading: "Saving...",
        success: "Berhasil login",
        error: "Gagal login",
      });
      const token = response.data.token;
      cookies.set("access_token", token, { secure: true, sameSite: "strict" });

      const userResponse = await axiosInstance.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuthUser(userResponse.data.data);
      setIsLoggedIn(true);
      navigate(location?.state?.prevUrl ? location?.state?.prevUrl : "/");
    } catch (error) {
      if (error.response.data.errorType === "validation") {
        error.response.data.message.email ? setErrorEmail(error.response.data.message.email) : setErrorEmail("");
        error.response.data.message.password ? setErrorPassword(error.response.data.message.password) : setErrorPassword("");
      } else if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
        error.response.data.errorType === "rateLimitExceeded" ? setErrorLimit(error.response.data.availableIn) : setErrorLimit("");
        error.response.data.errorType === "invalidPassword" ? setAttemptLeft(error.response.data.attemptsLeft) : setAttemptLeft("");
      }
    }
  };

  return {
    handleLogin,
    setEmail,
    setPassword,
    errorEmail,
    errorPassword,
    errorLimit,
    attemptLeft,
  };
};
