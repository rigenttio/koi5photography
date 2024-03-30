import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import Cookies from "universal-cookie";
import { useAuth } from "../context/AuthContext";

export const useUpdateProfile = (firstName, lastName, noTlp, address, avatar) => {
  const cookies = new Cookies();
  const { setAuthUser } = useAuth();

  const [errorFirstName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorNoTlp, setErrorNoTlp] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorAvatar, setErrorAvatar] = useState("");

  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append("no_tlp", noTlp);
  formData.append("address", address);
  {
    avatar && formData.append("avatar", avatar);
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axiosInstance.post("/user", formData, {
          headers: {
            Authorization: `Bearer ${cookies.get("access_token")}`,
            "Content-Type": "multipart/form-data",
            "X-HTTP-Method-Override": "PUT",
          },
        }),
        {
          loading: "Saving...",
          success: "Profile berhasil diupdate",
          error: "Gagal update profile",
        }
      );
      setAuthUser(response.data.data);
      setErrorFirstName("");
      setErrorLastName("");
      setErrorNoTlp("");
      setErrorAddress("");
      setErrorAvatar("");
    } catch (error) {
      if (error.response.data.errorType === "validation") {
        error.response.data.message.first_name ? setErrorFirstName(error.response.data.message.first_name) : setErrorFirstName("");
        error.response.data.message.last_name ? setErrorLastName(error.response.data.message.last_name) : setErrorLastName("");
        error.response.data.message.no_tlp ? setErrorNoTlp(error.response.data.message.no_tlp) : setErrorNoTlp("");
        error.response.data.message.address ? setErrorAddress(error.response.data.message.address) : setErrorAddress("");
        error.response.data.message.avatar ? setErrorAvatar(error.response.data.message.avatar) : setErrorAvatar("");
      }
    }
  };

  return {
    handleUpdateProfile,
    errorFirstName,
    errorLastName,
    errorNoTlp,
    errorAddress,
    errorAvatar,
  };
};
