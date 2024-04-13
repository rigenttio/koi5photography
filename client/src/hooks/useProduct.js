import React from "react";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useProduct = (branch_id, category_id, subCategory_id, nameProduct, description, price, thumbnail) => {
  const cookie = new Cookies();

  const formData = new FormData();
  formData.append("branch_id", branch_id);
  formData.append("category_id", category_id);
  {
    subCategory_id && formData.append("subcategory_id", subCategory_id);
  }
  formData.append("name", nameProduct);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("thumbnail", thumbnail);

  const handleProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axiosInstance.post("/product", formData, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token_admin")}`,
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Saving...",
          success: "Berhasil menambah produk",
          error: "Gagal menambah produk",
        }
      );
      return response.data.data;
    } catch (error) {}
  };

  return { handleProduct };
};
