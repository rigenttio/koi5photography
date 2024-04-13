import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import Status from "../../components/Elements/Status/Status";
import { HiOutlineEye } from "react-icons/hi";
import { useNavigate, useParams, useRoutes } from "react-router-dom";
import { Button, Modal, Pagination } from "flowbite-react";
import { axiosInstance } from "../../lib/axios";
import Cookies from "universal-cookie";
import { FormatRupiah } from "@arismun/format-rupiah";
import { FormatDate } from "../../lib/FormatDate";
import { env } from "../../lib/env";
import toast from "react-hot-toast";
import { useRefreshData } from "../../hooks/useRefreshData";
import Spinner from "../../components/Fragments/Loading/Spinner";

const customTheme = {
  root: {
    show: {
      on: "flex bg-black bg-opacity-50 dark:bg-opacity-80",
      off: "hidden",
    },
  },
};

const DataSewaPage = () => {
  const cookie = new Cookies();
  const { branchSlug } = useParams();
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [textExp, setTextExp] = useState(null);
  const { trigger, doTrigger } = useRefreshData();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const getOrders = async (page) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/order/get_by_branch/${branchSlug}?page=${page}&perPage=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token_admin")}`,
        },
      });
      setOrders(response.data.data.data);
      setTotalPages(response.data.data.last_page);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    setCurrentPage(1);
    setSearch("");

    if (branchSlug) {
      getOrders(1);
    }
  }, [branchSlug]);

  useEffect(() => {
    if (branchSlug) {
      getOrders(currentPage);
    }
  }, [trigger, currentPage]);

  useEffect(() => {
    if (selectedOrder) {
      let expirationDate = null;
      let textExp = null;
      switch (selectedOrder?.status) {
        case "belum bayar":
          expirationDate = selectedOrder.exp_pay;
          textExp = "(batas pembayaran)";
          break;
        case "dibayar":
          expirationDate = selectedOrder.exp_take;
          textExp = "(batas pengambilan barang)";
          break;
        case "diambil":
          expirationDate = selectedOrder.exp_rent;
          textExp = "(batas barang dikembalikan)";
          break;
        default:
          expirationDate = null;
          textExp = null;
          break;
      }
      setExpirationDate(expirationDate);
      setTextExp(textExp);
    }
  }, [selectedOrder]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setExpirationDate(null);
    setTextExp(null);
    setOpenModal(false);
  };

  const handleTandaiDiambil = async (id) => {
    try {
      await toast.promise(
        axiosInstance.patch(
          `/order/mark-take/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token_admin")}`,
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil menandai telah diambil",
          error: "Gagal menandai telah diambil",
        }
      );
      handleCloseModal();
      doTrigger();
    } catch (error) {}
  };

  const handleCancel = async (id) => {
    try {
      await toast.promise(
        axiosInstance.patch(
          `/order/cancel/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token_admin")}`,
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Pesanan berhasil dibatalkan",
          error: "Gagal membatalkan pesanan",
        }
      );
      handleCloseModal();
      doTrigger();
    } catch (error) {}
  };

  const handleTandaiSelesai = async (id) => {
    try {
      await toast.promise(
        axiosInstance.patch(
          `/order/mark-done/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token_admin")}`,
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil menandai telah dikembalikan",
          error: "Gagal menandai telah dikembalikan",
        }
      );
      handleCloseModal();
      doTrigger();
    } catch (error) {}
  };

  const handleRefund = async (id) => {
    try {
      await toast.promise(
        axiosInstance.patch(
          `/order/refund/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token_admin")}`,
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil mengembalikan dana",
          error: "Gagal mengembalikan dana",
        }
      );
      handleCloseModal();
      doTrigger();
    } catch (error) {}
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    getOrders(1);
  };

  return (
    <LayoutAdmin>
      <div>
        <h2 className="text-2xl font-semibold mb-6">Data Sewa</h2>
      </div>

      <div className="relative mb-5">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input
          type="text"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Cari id pesanan"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary/50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-lg">
        <table className="w-full text-sm text-left rtl:text-right ">
          <thead className="text-xs text-gray uppercase bg-slate-200 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama Produk
              </th>
              <th scope="col" className="px-6 py-3">
                Total Harga
              </th>
              <th scope="col" className="px-6 py-3">
                Id Pesanan
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Pengguna
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>

          {isLoading ? (
            <tbody>
              <tr className="bg-white border-b border-slate-200">
                <td colSpan="6" className="px-6 py-4">
                  <div className="flex h-16 items-center justify-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="bg-white border-b border-slate-200">
                    <th scope="row" className="px-6 py-4 font-semibold text-gray ">
                      {order.product.name}
                    </th>
                    <td className="px-6 py-4">
                      <FormatRupiah value={order.total_price} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4">
                      {order.user.first_name} {order.user.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <Status status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <HiOutlineEye onClick={() => handleOpenModal(order)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b border-slate-200">
                  <td colSpan="6" className="px-6 py-4">
                    <div className="text-center">Data Sewa Kosong</div>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>
      <div className="flex sm:justify-end overflow-x-auto justify-center mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} showIcons />
      </div>

      <Modal show={openModal} onClose={handleCloseModal} theme={customTheme} dismissible size="4xl">
        <Modal.Header className="text-gray">Detail</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-2 text-gray">
            <div className="">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <p className="min-w-32 text-sm font-semibold">ID Pesanan</p>
                  <p className="text-sm">{selectedOrder?.id}</p>
                </div>
                <div className="flex gap-1">
                  <p className="min-w-32 text-sm font-semibold">Nama</p>
                  <p className="text-sm">
                    {selectedOrder?.user.first_name} {selectedOrder?.user.last_name}
                  </p>
                </div>
                <div className="flex gap-1">
                  <p className="min-w-32 text-sm font-semibold">Nama Produk</p>
                  <p className="text-sm">{selectedOrder?.product.name}</p>
                </div>
                <div className="flex gap-1 items-center">
                  <p className="min-w-32 text-sm font-semibold">Status</p>
                  <Status status={selectedOrder?.status} />
                </div>
                <div className="flex gap-1">
                  <p className="min-w-32 text-sm font-semibold">No. Tlp</p>
                  <p className="text-sm">{selectedOrder?.user.no_tlp}</p>
                </div>
                {expirationDate && (
                  <div className="flex gap-1">
                    <p className="min-w-32 text-sm font-semibold">Batas Waktu</p>
                    <p className="text-sm">
                      <FormatDate value={expirationDate} /> <br /> {textExp}
                    </p>
                  </div>
                )}
                {selectedOrder?.status === "selesai" && (
                  <div className="flex gap-1">
                    <p className="min-w-32 text-sm font-semibold">Dikembalikan</p>
                    <p className="text-sm">
                      <FormatDate value={selectedOrder?.done_at} />
                    </p>
                  </div>
                )}
                {selectedOrder?.status === "dibatalkan" && (
                  <div className="flex gap-1">
                    <p className="min-w-32 text-sm font-semibold">Dibatalkan</p>
                    <p className="text-sm">
                      <FormatDate value={selectedOrder?.cancel_at} />
                    </p>
                  </div>
                )}
                <div className="flex gap-1">
                  <p className="min-w-32 text-sm font-semibold">Sewa</p>
                  <p className="text-sm">{selectedOrder?.quantity} Hari</p>
                </div>
                <div className="flex gap-1">
                  <p className="min-w-32 text-sm font-semibold">Total Harga</p>
                  <p className="text-sm">
                    <FormatRupiah value={selectedOrder?.total_price} />
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div>
                <img src={selectedOrder && `${env("VITE_IMAGE_BASE_URL")}/products/${selectedOrder.product.thumbnail}`} className="w-[200px] h-[200px]" />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {selectedOrder?.status === "dibayar" && (
            <Button className="bg-orange-400 hover:!bg-orange-500" onClick={() => handleTandaiDiambil(selectedOrder?.id)}>
              Tandai telah diambil
            </Button>
          )}
          {selectedOrder?.status === "diambil" && (
            <Button className="bg-blue-500 hover:!bg-blue-600" onClick={() => handleTandaiSelesai(selectedOrder?.id)}>
              Tandai telah dikembalikan
            </Button>
          )}

          {/* cancel */}
          {(selectedOrder?.status === "belum bayar" || selectedOrder?.status === "dibayar") && (
            <Button disabled={selectedOrder?.transaction_status === "settlement"} className="bg-red-500 hover:!bg-red-600" onClick={() => handleCancel(selectedOrder?.id)}>
              Batalkan Pesanan
            </Button>
          )}

          {/* refund */}
          {selectedOrder?.status === "dibayar" && (
            <Button /* disabled={selectedOrder?.transaction_status === "capture"} */ disabled className="bg-red-500 hover:!bg-red-600" onClick={() => handleRefund(selectedOrder?.id)}>
              Refund Dana
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </LayoutAdmin>
  );
};

export default DataSewaPage;
