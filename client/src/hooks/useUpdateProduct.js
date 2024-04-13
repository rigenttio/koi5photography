import React from "react";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useUpdateProduct = (nameProduct, description, price, thumbnail) => {
  const cookie = new Cookies();

  const formData = new FormData();
  formData.append("name", nameProduct);
  formData.append("description", description);
  formData.append("price", price);
  {
    thumbnail && formData.append("thumbnail", thumbnail);
  }

  const handleUpdateProduct = async (id, e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axiosInstance.post(`/product/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token_admin")}`,
            "X-HTTP-Method-Override": "PUT",
          },
        }),
        {
          loading: "Saving...",
          success: "Berhasil update produk",
          error: "Gagal update produk",
        }
      );
    } catch (error) {}
  };

  return { handleUpdateProduct };
};
