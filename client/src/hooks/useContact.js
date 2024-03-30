import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useContact = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  console.log(email);

  const [errorEmail, setErrorEmail] = useState("");
  const [errorSubject, setErrorSubject] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formData = new FormData();
  formData.append("email", email);
  formData.append("subject", subject);
  formData.append("message", message);

  const handleContact = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(axiosInstance.post("/contact", formData), {
        loading: "Saving...",
        success: "Berhasil mengirim",
        error: "Gagal mengirim",
      });
      setEmail("");
      setSubject("");
      setMessage("");
      setErrorEmail("");
      setErrorSubject("");
      setErrorMessage("");
    } catch (error) {
      error.response.data.errors.email ? setErrorEmail(error.response.data.errors.email) : setErrorEmail("");
      error.response.data.errors.subject ? setErrorSubject(error.response.data.errors.subject) : setErrorSubject("");
      error.response.data.errors.message ? setErrorMessage(error.response.data.errors.message) : setErrorMessage("");
    }
  };

  return {
    handleContact,
    email,
    subject,
    message,
    setEmail,
    setSubject,
    setMessage,
    errorEmail,
    errorSubject,
    errorMessage,
  };
};
