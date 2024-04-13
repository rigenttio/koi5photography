import React from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import Cookies from "universal-cookie";

export const useUpdateUser = (firstName, lastName, noTlp, address, email) => {
  const cookie = new Cookies();

  const formData = new FormData();
  formData.append("first_name", firstName);
  formData.append("last_name", lastName);
  formData.append("no_tlp", noTlp);
  formData.append("address", address);
  formData.append("email", email);

  const handleUpdateUser = async (id, e) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        axiosInstance.post(`/user/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token_admin")}`,
            "X-HTTP-Method-Override": "PUT",
          },
        }),
        {
          loading: "Saving...",
          success: "Berhasil update user",
          error: "Gagal update user",
        }
      );
    } catch (error) {}
  };

  return {
    handleUpdateUser,
  };
};
