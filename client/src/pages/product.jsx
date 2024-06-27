import React, { useEffect, useState } from "react";
import Navbar from "../components/Fragments/NavBar";
import Button from "../components/Elements/Button/Button";
import Footer from "../components/Fragments/Footer";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { FormatRupiah } from "@arismun/format-rupiah";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../hooks/useOrder";
import Cookies from "universal-cookie";
import LoadingPurchase from "../components/Fragments/Loading/LoadingPurchase";
import toast from "react-hot-toast";
import { env } from "../lib/env";
import { DateRange } from "react-date-range";
import { id } from "date-fns/locale";
import moment from "moment";

const ProductPage = () => {
  const [product, setProduct] = useState();
  const { productSlug } = useParams();
  const { handleOrder, quantity, dateValue, setDateValue, setQuantity, total, setTotal } = useOrder();
  const [userBookmarks, setUserBookmarks] = useState([]);
  const { isLoggedIn } = useAuth();
  const cookie = new Cookies();
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { startDate, endDate } = dateValue[0];

  console.log(dateValue[0].endDate);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axiosInstance.get(`/product/${productSlug}`);
        setProduct(response.data.data);

        if (isLoggedIn) {
          const response = await axiosInstance.get("/bookmark", {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token")}`,
            },
          });
          setUserBookmarks(response.data.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (productSlug) {
      getProduct();
    }
  }, [productSlug, isLoggedIn]);

  useEffect(() => {
    if (product && userBookmarks.length > 0) {
      const isBookmarked = isProductBookmarked(userBookmarks, product.id);
      setBookmarked(isBookmarked);
    }
  }, [product, userBookmarks]);

  const isProductBookmarked = (bookmarks, productId) => {
    return bookmarks.some((bookmark) => bookmark.pivot.product_id === productId);
  };

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      return navigate("/login");
    }
    try {
      if (bookmarked) {
        await axiosInstance.delete(`/bookmark/${product.id}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token")}`,
          },
        });
        toast("Produk dihapus dari Bookmark", {
          icon: "🖇️",
        });
      } else {
        await axiosInstance.post(`/bookmark/${product.id}`, null, {
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

  useEffect(() => {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    setQuantity(endMoment.diff(startMoment, "days"));
  }, [dateValue, product]);

  useEffect(() => {
    if (quantity && product && product.price) {
      setTotal(quantity * product.price);
    }
  }, [quantity, product]);

  return (
    <>
      <Navbar />

      {isLoading ? (
        <LoadingPurchase />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 container mt-16">
          <div className="flex justify-center lg:justify-start">
            <img src={product && `${env("VITE_IMAGE_BASE_URL")}/products/${product.thumbnail}`} alt="" className="object-contain rounded-lg md:h-[500px] md:w-[500px] bg-gray" />
          </div>
          <div className="flex flex-col">
            <div className="flex gap-3 justify-between">
              <h4 className="font-bold text-4xl leading-10 line-clamp-2">{product && product.name}</h4>
              <div className="cursor-pointer hover:scale-105" onClick={handleBookmarkClick}>
                <i className={`fa-bookmark ${bookmarked ? "fa-solid text-yellow-300" : "fa-regular text-gray"} text-4xl`}></i>
              </div>
            </div>
            <div className="flex bg-gray py-4 px-6 mt-[18px]">
              {product && (
                <span className="text-2xl font-medium">
                  <FormatRupiah value={product.price} />
                  /Hari
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex mt-6 items-center">
                <p className="min-w-[105px] text-sm text-neutral-400">Cabang</p>
                <Link target="_blank" rel="noopener noreferrer" to={product && product.branch.googlemap_url} className="text-sm text-primary py-[5px] px-[10px] bg-primary bg-opacity-[12%] uppercase">
                  {product && product.branch.name}
                </Link>
              </div>
              <div className="flex items-center">
                <p className="min-w-[105px] text-sm text-neutral-400">Ketersediaan</p>
                {product && product.is_stock ? (
                  <span className="text-sm text-green-400 py-[5px] px-[10px] bg-green-400 bg-opacity-[12%] rounded-[15px]">Tersedia</span>
                ) : (
                  <span className="text-sm text-red-400 py-[5px] px-[10px] bg-red-400 bg-opacity-[12%] rounded-[15px]">Tidak Tersedia</span>
                )}
              </div>
              <div className="flex ">
                <p className="min-w-[105px] text-sm text-neutral-400">Deskripsi</p>
                <p className="text-sm ">{product && product.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 items-center mt-24">
              <p className="min-w-[105px] text-sm text-neutral-400">Pilih Tanggal</p>
              <div className="flex w-full justify-center">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    const { selection } = item;
                    const startMoment = moment(selection.startDate);
                    const endMoment = moment(selection.endDate);

                    if (endMoment.isSameOrBefore(startMoment)) {
                      selection.endDate = startMoment.clone().add(1, "days").toDate();
                    }

                    setDateValue([selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={dateValue}
                  rangeColors={["#E42030"]}
                  locale={id}
                  minDate={new Date()}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-start sm:flex-row sm:justify-between items-center mt-12">
              <div className="flex">
                <p className="min-w-[105px] text-lg font-semibold">Total</p>
                <p className="text-lg font-semibold">{product && <FormatRupiah value={total} />}</p>
              </div>
              <Button onClick={product && product.is_stock ? () => handleOrder(product.id) : null} disabled={product && !product.is_stock}>
                Mulai Sewa
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductPage;
