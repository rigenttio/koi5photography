import React, { useEffect, useState } from "react";
import ItemNotFound from "../../components/Elements/NotFound/ItemNotFound";
import Cookies from "universal-cookie";
import { axiosInstance } from "../../lib/axios";
import LoadingPurchase from "../../components/Fragments/Loading/LoadingPurchase";
import CardPengembalianBarang from "../../components/Fragments/Card/CardPengembalianBarang";

const PengembalianBarang = () => {
  const [order, setOrder] = useState([]);
  const cookie = new Cookies();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await axiosInstance.get("/order/take", {
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

  return <>{isLoading ? <LoadingPurchase /> : <div className="flex flex-col gap-6">{order.length > 0 ? order.map((ord) => <CardPengembalianBarang key={ord.id} order={ord} />) : <ItemNotFound />}</div>}</>;
};

export default PengembalianBarang;
