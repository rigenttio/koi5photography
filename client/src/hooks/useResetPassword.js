import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

export const useResetPassword = (email, token) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorPassword, setErrorPassword] = useState("");
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState("");

  const formData = new FormData();
  formData.append("email", email);
  formData.append("token", token);
  formData.append("password", password);
  formData.append("password_confirmation", passwordConfirm);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(
        axiosInstance.post("/reset-password", formData, {
          headers: {
            "X-HTTP-Method-Override": "PATCH",
          },
        }),
        {
          loading: "Saving...",
          success: "Password berhasil direset",
          error: "Gagal reset password",
        }
      );
      localStorage.removeItem("verification");
      navigate("/login");
    } catch (error) {
      if (error.response.data.errorType === "validation") {
        error.response.data.message.password ? setErrorPassword(error.response.data.message.password) : setErrorPassword("");
        error.response.data.message.password_confirmation ? setErrorPasswordConfirm(error.response.data.message.password_confirmation) : setErrorPasswordConfirm("");
      }
    }
  };

  return {
    handleResetPassword,
    setPassword,
    setPasswordConfirm,
    errorPassword,
    errorPasswordConfirm,
  };
};
