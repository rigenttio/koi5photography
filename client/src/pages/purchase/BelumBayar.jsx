import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("transaction_status");

    if (status === "capture" || status === "settlement") {
      navigate(location.pathname);
      setActiveItems("Pengambilan Barang");
      return () => toast.success("Segera ambil barang");
    }
  }, [location.search, navigate, setActiveItems]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getOrder = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/order/no_paid?perPage=5&page=${page}`, {
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
              setActiveItems={setActiveItems}
            />
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

export default BelumBayar;
