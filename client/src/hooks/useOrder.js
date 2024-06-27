import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import moment from "moment";

export const useOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const cookie = new Cookies();

  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [dateValue, setDateValue] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const { startDate, endDate } = dateValue[0];

  const handleOrder = async (productId) => {
    if (!isLoggedIn) {
      return navigate("/login", { state: { prevUrl: location.pathname } });
    } else if (!startDate || !endDate) {
      toast.error("Silahkan pilih tanggal penyewaan");
    }

    try {
      const response = await toast.promise(
        axiosInstance.post(
          "/order",
          {
            product_id: productId,
            quantity: quantity,
            start_date: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
            end_date: moment(endDate).format("YYYY-MM-DD HH:mm:ss"),
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
    total,
    setTotal,
    isLoggedIn,
    dateValue,
    setDateValue,
    quantity,
    setQuantity,
  };
};
