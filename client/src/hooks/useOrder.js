import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

export const useOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const cookie = new Cookies();

  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  const handleOrder = async (productId) => {
    if (!isLoggedIn) {
      return navigate("/login", { state: { prevUrl: location.pathname } });
    } else if (quantity == 0 || quantity == null) {
      setQuantity(1);
    }

    try {
      const response = await toast.promise(
        axiosInstance.post(
          "/order",
          {
            product_id: productId,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token")}`,
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Silahkan lakukan pembayaran",
          error: "Terjadi kesalahan",
        }
      );
      navigate("/purchase");
    } catch (error) {}
  };

  return {
    handleOrder,
    quantity,
    setQuantity,
    total,
    setTotal,
    isLoggedIn,
  };
};
