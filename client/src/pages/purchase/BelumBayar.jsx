import React, { useEffect, useState } from "react";
import CardBelumBayar from "../../components/Fragments/Card/CardBelumBayar";
import { axiosInstance } from "../../lib/axios";
import Cookies from "universal-cookie";
import { useSnap } from "../../hooks/useSnap";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ItemNotFound from "../../components/Elements/NotFound/ItemNotFound";
import LoadingPurchase from "../../components/Fragments/Loading/LoadingPurchase";

const BelumBayar = ({ setActiveItems }) => {
  const [order, setOrder] = useState([]);
  const cookie = new Cookies();
  const { handleSnapPay } = useSnap();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("transaction_status");

    if (status === "capture" || status === "settlement") {
      navigate(location.pathname);
      setActiveItems("Pengambilan Barang");
      return () => toast.success("Segera ambil barang");
    }
  }, [location.search, navigate, setActiveItems]);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await axiosInstance.get("/order/no_paid", {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token")}`,
          },
        });
        setOrder(response.data.data);
        setIsLoading(false);
      } catch (error) {}
    };
    getOrder();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPurchase />
      ) : (
        <div className="flex flex-col gap-6">
          {order.length > 0 ? (
            order.map((ord) => (
              <CardBelumBayar
                key={ord.id}
                onClick={() =>
                  handleSnapPay(ord.token_snap, {
                    onClose: function () {
                      navigate("/purchase");
                    },
                  })
                }
                order={ord}
              />
            ))
          ) : (
            <ItemNotFound />
          )}
        </div>
      )}
    </>
  );
};

export default BelumBayar;
