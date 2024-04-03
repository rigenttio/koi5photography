import React, { useCallback, useEffect, useRef, useState } from "react";
import ItemNotFound from "../../components/Elements/NotFound/ItemNotFound";
import Cookies from "universal-cookie";
import { axiosInstance } from "../../lib/axios";
import LoadingPurchase from "../../components/Fragments/Loading/LoadingPurchase";
import CardPengembalianBarang from "../../components/Fragments/Card/CardPengembalianBarang";

const PengembalianBarang = () => {
  const [order, setOrder] = useState([]);
  const cookie = new Cookies();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const intObserver = useRef();

  const listEndRef = useCallback(
    (node) => {
      if (isLoading || !hasNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();
      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) intObserver.current.observe(node);
    },
    [isLoading, hasNextPage]
  );

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getOrder = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/order/take?perPage=5&page=${page}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token")}`,
          },
          signal,
        });
        setHasNextPage(response.data.data.next_page_url !== null);
        setOrder((prev) => {
          return [...new Set([...prev, ...response.data.data.data])];
        });
        setIsLoading(false);
      } catch (error) {}
    };
    getOrder();

    return () => controller.abort();
  }, [page]);

  return (
    <div className="flex flex-col gap-6">
      {order.length > 0 ? (
        order.map((ord, index) => (
          <React.Fragment key={ord.id}>
            <CardPengembalianBarang key={ord.id} order={ord} />
            {index === order.length - 1 && <div ref={listEndRef}></div>}
          </React.Fragment>
        ))
      ) : isLoading ? (
        <LoadingPurchase />
      ) : (
        <ItemNotFound />
      )}
    </div>
  );
};

export default PengembalianBarang;
