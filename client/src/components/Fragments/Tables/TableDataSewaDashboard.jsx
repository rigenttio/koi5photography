import { FormatRupiah } from "@arismun/format-rupiah";
import React from "react";
import Status from "../../Elements/Status/Status";

const TableDataSewaDashboard = (props) => {
  const { orders } = props;

  return (
    <div className="rounded-sm border border-slate-100 bg-white shadow-lg ">
      <div className="py-6 px-4 md:px-6 xl:px-7">
        <h4 className="text-xl font-semibold text-black dark:text-white">Data Sewa</h4>
      </div>

      <div className="grid grid-cols-9 border-t border-stroke py-4 px-4  md:px-6 2xl:px-7">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Pengguna</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Nama Produk</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Cabang</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">ID Pesanan</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Total Harga</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Status</p>
        </div>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="grid grid-cols-9 border-t border-slate-200 py-4 px-4  md:px-6 2xl:px-7">
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12 w-12 rounded-2xl overflow-hidden">
                <img src="/default-avatar.png" alt="Product" className="overflow-hidden" />
              </div>
              <p className="text-sm text-black dark:text-white">
                {order.user.first_name} {order.user.last_name}
              </p>
            </div>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-sm text-black dark:text-white">{order.product.name}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{order.product.branch.name}</p>
          </div>
          <div className="col-span-2 flex items-center whitespace-nowrap">
            <p className="text-sm text-black dark:text-white">{order.id}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-meta-3">
              <FormatRupiah value={order.total_price} />
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <Status status={order.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableDataSewaDashboard;
