import React, { useEffect, useState } from "react";
import SidebarAuthLayout from "../components/Layouts/SidebarAuthLayout";
import { axiosInstance } from "../lib/axios";
import Cookies from "universal-cookie";
import CardSkeleton from "../components/Fragments/Loading/CardSkeleton";
import CardProduct from "../components/Fragments/Card/CardProduct";
import toast from "react-hot-toast";
import BookmarkNotFound from "../components/Elements/NotFound/BookmarkNotFound";

const BookmarkPage = () => {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const cookie = new Cookies();

  useEffect(() => {
    const getBookmark = async () => {
      try {
        const response = await axiosInstance.get("/bookmark", {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token")}`,
          },
        });
        setProducts(response.data.data);
        setIsLoading(false);
      } catch (error) {}
    };

    getBookmark();
  }, []);

  const unbookmarkProduct = async (productId) => {
    try {
      await axiosInstance.delete(`/bookmark/${productId}`, {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token")}`,
        },
      });

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      toast.success("bookmark dihapus!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SidebarAuthLayout>
      <div className="m-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {isLoading ? (
            <CardSkeleton count={3} />
          ) : products.length > 0 ? (
            products.map((product) => (
              <CardProduct
                key={product.id}
                onUnbookmark={() => unbookmarkProduct(product.id)}
                isBookmarked={true}
                productId={product.id}
                image={product.thumbnail}
                stock={product.is_stock}
                branch={product.branch.name}
                price={product.price}
                to={product.slug}
              >
                {product.name}
              </CardProduct>
            ))
          ) : (
            <BookmarkNotFound />
          )}
        </div>
      </div>
    </SidebarAuthLayout>
  );
};

export default BookmarkPage;
