import React, { useEffect, useState } from "react";
import Spinner from "../../components/Fragments/Loading/Spinner";
import LoadingPurchase from "../../components/Fragments/Loading/LoadingPurchase";
import ItemNotFound from "../../components/Elements/NotFound/ItemNotFound";
import { axiosInstance } from "../../lib/axios";
import Cookies from "universal-cookie";
import CardSelesai from "../../components/Fragments/Card/CardSelesai";

const Selesai = () => {
  const [order, setOrder] = useState([]);
  const cookie = new Cookies();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await axiosInstance.get("/order/done", {
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

  return <>{isLoading ? <LoadingPurchase /> : <div className="flex flex-col gap-6">{order.length > 0 ? order.map((ord) => <CardSelesai key={ord.id} order={ord} />) : <ItemNotFound />}</div>}</>;
};

export default Selesai;
