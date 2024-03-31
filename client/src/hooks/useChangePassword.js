import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

export const useChangePassword = () => {
  const navigate = useNavigate();
  const cookie = new Cookies();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");

  const [errorOldPassword, setErrorOldPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [failedOldPassword, setFailedOldPassword] = useState("");

  const formData = new FormData();
  formData.append("old_password", oldPassword);
  formData.append("password", password);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/change-password", formData, {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token")}`,
          "X-HTTP-Method-Override": "PATCH",
        },
      });
      toast.success("Berhasil ubah kata sandi");
      navigate("/profile");
    } catch (error) {
      setOldPassword("");
      setPassword("");
      if (error.response.data.errorType === "oldPassword") {
        setFailedOldPassword("Password lama salah");
      } else if (error.response.data.errorType === "validation") {
        error.response.data.message.old_password ? setErrorOldPassword(error.response.data.message.old_password) : setErrorOldPassword("");
        error.response.data.message.password ? setErrorPassword(error.response.data.message.password) : setErrorPassword("");
      } else {
        toast.error("Gagal ubah password");
      }
    }
  };

  return {
    handleChangePassword,
    oldPassword,
    password,
    errorOldPassword,
    errorPassword,
    failedOldPassword,
    setOldPassword,
    setPassword,
  };
};
