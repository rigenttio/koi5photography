import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { redirect, useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();

  const [firtsName, setFirtsName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [noTlp, setNoTlp] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorFirtsName, setErrorFirtsName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorNoTlp, setErrorNoTlp] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState("");

  const formData = new FormData();
  formData.append("first_name", firtsName);
  formData.append("last_name", lastName);
  formData.append("email", email);
  formData.append("no_tlp", noTlp);
  formData.append("address", address);
  formData.append("password", password);
  formData.append("password_confirmation", passwordConfirm);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(axiosInstance.post("/register", formData), {
        loading: "Saving...",
        success: "Silahkan verifikasi email anda",
        error: "Gagal melakukan pendaftaran",
      });
      localStorage.setItem("verification", JSON.stringify({ type: "verif-email", email: email }));
      navigate("/verification");
    } catch (error) {
      if (error.response.data.errorType === "validation") {
        error.response.data.message.first_name ? setErrorFirtsName(error.response.data.message.first_name) : setErrorFirtsName("");
        error.response.data.message.last_name ? setErrorLastName(error.response.data.message.last_name) : setErrorLastName("");
        error.response.data.message.email ? setErrorEmail(error.response.data.message.email) : setErrorEmail("");
        error.response.data.message.no_tlp ? setErrorNoTlp(error.response.data.message.no_tlp) : setErrorNoTlp("");
        error.response.data.message.address ? setErrorAddress(error.response.data.message.address) : setErrorAddress("");
        error.response.data.message.password ? setErrorPassword(error.response.data.message.password) : setErrorPassword("");
        error.response.data.message.password_confirmation ? setErrorPasswordConfirm(error.response.data.message.password_confirmation) : setErrorPasswordConfirm("");
      }
    }
  };

  return {
    handleRegister,
    setFirtsName,
    setLastName,
    setEmail,
    setNoTlp,
    setAddress,
    setPassword,
    setPasswordConfirm,
    errorFirtsName,
    errorLastName,
    errorEmail,
    errorNoTlp,
    errorAddress,
    errorPassword,
    errorPasswordConfirm,
  };
};
