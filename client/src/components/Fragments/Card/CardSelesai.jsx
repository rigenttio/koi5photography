import { FormatRupiah } from "@arismun/format-rupiah";
import React from "react";
import { Link } from "react-router-dom";
import { env } from "../../../lib/env";
import { FormatDate } from "../../../lib/FormatDate";

const CardSelesai = (props) => {
  const { order } = props;
  return (
    <div className="bg-gray p-6">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <Link target="_blank" rel="noopener noreferrer" to={order.product.branch.googlemap_url} className="text-sm text-primary py-[5px] px-[10px] bg-primary bg-opacity-[12%] uppercase">
              {order.product.branch.name}
            </Link>
            <span className="text-xs capitalize text-[#AAAAAA]">{order.status}</span>
          </div>
        </div>
        <hr className="h-2 text-primary/20" />
        <div className="flex gap-5">
          <Link to={`/product/${order.product.slug}`}>
            <img src={`${env("VITE_IMAGE_BASE_URL")}/products/${order.product.thumbnail}`} alt="product" className="w-20 h-20 object-contain" />
          </Link>
          <div className="flex flex-col gap-2">
            <h4>{order.product.name}</h4>
            <span className="text-sm">{order.quantity} Hari</span>
          </div>
        </div>
        <hr className="h-2 text-primary/20" />
        <div className="bg-primary/5 py-4 px-2">
          <div className="flex flex-col gap-3">
            <div className="flex">
              <span className="min-w-[145px] text-xs text-neutral-400">ID Pesanan</span>
              <span className="text-xs">{order.id}</span>
            </div>
            <div className="flex">
              <span className="min-w-[145px] text-xs text-neutral-400">Dikembalikan Tanggal</span>
              <span className="text-xs">
                <FormatDate value={order.done_at} />
              </span>
            </div>
            <div className="flex">
              <span className="min-w-[145px] text-xs text-neutral-400">Tanggal Sewa</span>
              <span className="text-xs">
                <FormatDate showTime={false} value={order.start_date} /> - <FormatDate showTime={false} value={order.end_date} />
              </span>
            </div>
            <div className="flex">
              <span className="min-w-[145px] text-xs text-neutral-400">Alamat Toko</span>
              <span className="text-xs">{order.product.branch.address}</span>
            </div>
            <div className="flex flex-col gap-6 mt-3">
              <div className="flex gap-3 justify-end">
                <h2 className="text-neutral-400">Total Pesanan :</h2>
                <p>
                  <FormatRupiah value={order.total_price} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSelesai;
