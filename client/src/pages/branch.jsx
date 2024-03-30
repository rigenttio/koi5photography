import React, { Suspense, lazy, useEffect, useState } from "react";
import SidebarBranchLayout from "../components/Layouts/SidebarBranchLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Skeleton from "react-loading-skeleton";
import CardProduct from "../components/Fragments/Card/CardProduct";
import CardSkeleton from "../components/Fragments/Loading/CardSkeleton";
import { useAuth } from "../context/AuthContext";
import Cookies from "universal-cookie";
import ProductNotFound from "../components/Elements/NotFound/ProductNotFound";

// const CardProduct = lazy(() => import("../components/Fragments/Card/CardProduct"));

const BranchPage = () => {
  const [products, setProducts] = useState();
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { branchSlug, categorySlug, subCategorySlug } = useParams();
  const { isLoggedIn } = useAuth();
  const cookie = new Cookies();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (branchSlug && categorySlug && subCategorySlug) {
          const response = await axiosInstance.get(`/product/get_by_subcategory/${branchSlug}/${categorySlug}/${subCategorySlug}`);
          setProducts(response.data.data);
        } else if (branchSlug && categorySlug) {
          const response = await axiosInstance.get(`/product/get_by_category/${branchSlug}/${categorySlug}`);
          setProducts(response.data.data);
        } else if (branchSlug) {
          const response = await axiosInstance.get(`/product/get_by_branch/${branchSlug}`);
          setProducts(response.data.data);
        }

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

    fetchData();
  }, [branchSlug, categorySlug, subCategorySlug, isLoggedIn]);

  const isProductBookmarked = (productId) => {
    return userBookmarks.some((bookmark) => bookmark.pivot.product_id === productId);
  };

  return (
    <SidebarBranchLayout>
      <div className="m-16">
        {/* filter */}
        <div className="bg-gray mb-6 py-3 px-3 flex justify-between items-center">
          <select className="bg-gray py-2 px-3 rounded-lg focus:ring-primary focus:border-primary block">
            <option value="" disabled>
              Harga
            </option>
            <option value="asc">Rendah ke Tinggi</option>
            <option value="dsc">Tinggi ke Rendah</option>
          </select>

          <div className="relative">
            <input className="bg-white text-dark py-2 px-3 rounded-lg pl-11" type="text" placeholder="Search" />
            <i className="absolute fa-solid text-dark fa-magnifying-glass left-3 top-1/2 -translate-y-1/2"></i>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 ">
          {isLoading ? (
            <CardSkeleton count={3} />
          ) : products.length > 0 ? (
            products.map((product) => (
              <CardProduct key={product.id} isBookmarked={isProductBookmarked(product.id)} productId={product.id} image={product.thumbnail} stock={product.is_stock} branch={product.branch.name} price={product.price} to={product.slug}>
                {product.name}
              </CardProduct>
            ))
          ) : (
            <ProductNotFound />
          )}
        </div>
      </div>
    </SidebarBranchLayout>
  );
};

export default BranchPage;
