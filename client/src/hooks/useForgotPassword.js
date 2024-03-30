import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(
        axiosInstance.post("/forgot-password", {
          email: email,
        }),
        {
          loading: "Saving...",
          success: "Silahkan cek email anda",
          error: "Terjadi kesalahan",
        }
      );
      localStorage.setItem("verification", JSON.stringify({ type: "forgot-password", email: email }));
      navigate("/verification");
    } catch (error) {
      if (error.response.data.errorType === "validation") {
        error.response.data.message.email ? setErrorEmail(error.response.data.message.email) : setErrorEmail("");
      }
    }
  };

  return {
    handleForgotPassword,
    setEmail,
    errorEmail,
  };
};
