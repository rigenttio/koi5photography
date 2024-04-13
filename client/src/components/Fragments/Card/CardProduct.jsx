import { FormatRupiah } from "@arismun/format-rupiah";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { axiosInstance } from "../../../lib/axios";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import { env } from "../../../lib/env";

const CardProduct = (props) => {
  const { children, image, stock, price, branch, to, isBookmarked, productId, onUnbookmark } = props;
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const cookie = new Cookies();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      return navigate("/login");
    }
    try {
      if (onUnbookmark) {
        return onUnbookmark(productId);
      } else if (bookmarked) {
        await axiosInstance.delete(`/bookmark/${productId}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token")}`,
          },
        });
        toast("Produk dihapus dari Bookmark", {
          icon: "🖇️",
        });
      } else {
        await axiosInstance.post(`/bookmark/${productId}`, null, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token")}`,
          },
        });
        toast("Produk ditambahkan ke Bookmark", {
          icon: "🔖",
        });
      }
      setBookmarked(!bookmarked);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray rounded-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300">
      <div className="relative">
        <img className="object-cover object-center h-64 w-full" src={`${env("VITE_IMAGE_BASE_URL")}/products/${image}`} alt="product" />
        <span className="absolute top-3 left-3 uppercase text-xs py-1 px-2 rounded-lg bg-gray">{branch}</span>
        <div className="absolute top-3 right-6 cursor-pointer hover:scale-105" onClick={handleBookmarkClick}>
          <i className={`fa-bookmark ${bookmarked ? "fa-solid text-yellow-400" : "fa-regular text-gray"} text-2xl`}></i>
        </div>
      </div>
      <div className="p-6 ">
        <div className="flex flex-col min-h-40 justify-between">
          <div className="flex flex-col gap-3">
            <h5 title={children} className="line-clamp-2 text-lg font-medium">
              {children}
            </h5>
          </div>
          <div>
            <p>
              <FormatRupiah value={price} />
              /Hari
            </p>
            <div className="flex justify-between items-center mt-6">
              {stock ? <p className="text-xs text-green-400">Tersedia</p> : <p className="text-xs text-red-400">Tidak Tersedia</p>}
              <Link to={`/product/${to}`} className="py-1 px-6 bg-primary text-base font-normal rounded-xl hover:bg-[#c70e1d] hover:scale-105 duration-300">
                Detail
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
