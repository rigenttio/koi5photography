import React, { useEffect, useState } from "react";
import CardPengambilanBarang from "../../components/Fragments/Card/CardPengambilanBarang";
import Cookies from "universal-cookie";
import LoadingPurchase from "../../components/Fragments/Loading/LoadingPurchase";
import ItemNotFound from "../../components/Elements/NotFound/ItemNotFound";
import { axiosInstance } from "../../lib/axios";

const PengambilanBarang = () => {
  const [order, setOrder] = useState([]);
  const cookie = new Cookies();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await axiosInstance.get("/order/paid", {
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

  return <>{isLoading ? <LoadingPurchase /> : <div className="flex flex-col gap-6">{order.length > 0 ? order.map((ord) => <CardPengambilanBarang key={ord.id} order={ord} />) : <ItemNotFound />}</div>}</>;
};

export default PengambilanBarang;
