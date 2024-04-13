import { Avatar, Dropdown, Navbar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import NavbarAdmin from "../../components/Fragments/NavBar/NavbarAdmin";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import CardDataStats from "../../components/Fragments/Card/CardDataStats";
import { HiOutlineShoppingCart, HiOutlineTruck, HiOutlineSave, HiOutlineUsers, HiOutlineXCircle, HiOutlineShoppingBag, HiOutlineUserAdd, HiOutlineCurrencyDollar } from "react-icons/hi";
import TableDataSewaDashboard from "../../components/Fragments/Tables/TableDataSewaDashboard";
import { axiosInstance } from "../../lib/axios";
import Cookies from "universal-cookie";
import Spinner from "../../components/Fragments/Loading/Spinner";
import { FormatRupiah } from "@arismun/format-rupiah";

const DashboardPage = () => {
  const cookie = new Cookies();
  const [isLoading, setIsloading] = useState(true);
  const [count, setCount] = useState();
  const [orders, setOrders] = useState();

  const getCount = async () => {
    try {
      setIsloading(true);
      const response = await axiosInstance.get("/dashboard/count", {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token_admin")}`,
        },
      });
      setCount(response.data.data);
      setIsloading(false);
    } catch (error) {}
  };

  const getOrder = async () => {
    try {
      setIsloading(true);
      const response = await axiosInstance.get("/order?perPage=5&page=1", {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token_admin")}`,
        },
      });
      setOrders(response.data.data.data);
      setIsloading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getCount();
    getOrder();
  }, []);
  return (
    <LayoutAdmin>
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
            {count && (
              <>
                <CardDataStats title="Menunggu Pembayaran" total={count.no_paid}>
                  <HiOutlineShoppingCart className="text-primary w-6 h-6" />
                </CardDataStats>
                <CardDataStats title="Menunggu Pengambilan" total={count.paid}>
                  <HiOutlineTruck className="text-primary w-6 h-6" />
                </CardDataStats>
                <CardDataStats title="Belum Dikembalikan" total={count.take}>
                  <HiOutlineSave className="text-primary w-6 h-6" />
                </CardDataStats>
                <CardDataStats title="Total Sewa" total={count.done}>
                  <HiOutlineUsers className="text-primary w-6 h-6" />
                </CardDataStats>
                <CardDataStats title="Total Dibatalkan" total={count.cancel}>
                  <HiOutlineXCircle className="text-primary w-6 h-6" />
                </CardDataStats>
                <CardDataStats title="Jumlah Produk" total={count.products}>
                  <HiOutlineShoppingBag className="text-primary w-6 h-6" />
                </CardDataStats>
                <CardDataStats title="Jumlah Pengguna" total={count.users}>
                  <HiOutlineUserAdd className="text-primary w-6 h-6" />
                </CardDataStats>
                <CardDataStats title="Pendapatan" total={<FormatRupiah value={count.pendapatan} />}>
                  <HiOutlineCurrencyDollar className="text-primary w-6 h-6" />
                </CardDataStats>
              </>
            )}
          </div>

          {orders && (
            <div className="mt-10">
              <TableDataSewaDashboard orders={orders} />
            </div>
          )}
        </>
      )}
    </LayoutAdmin>
  );
};

export default DashboardPage;
