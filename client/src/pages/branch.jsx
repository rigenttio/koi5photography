import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
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
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { branchSlug, categorySlug, subCategorySlug } = useParams();
  const { isLoggedIn } = useAuth();
  const cookie = new Cookies();

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

  const fetchData = async (signal, currentPage) => {
    try {
      setIsLoading(true);

      if (isLoggedIn) {
        const response = await axiosInstance.get("/bookmark", {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token")}`,
          },
          signal,
        });
        setUserBookmarks(response.data.data);
      }

      let fetchPage = currentPage;
      if (branchSlug && categorySlug && subCategorySlug) {
        const response = await axiosInstance.get(`/product/get_by_subcategory/${branchSlug}/${categorySlug}/${subCategorySlug}?page=${fetchPage}&perPage=10`, { signal });
        setHasNextPage(response.data.data.next_page_url !== null);
        setProducts((prevProducts) => {
          return [...new Set([...prevProducts, ...response.data.data.data])];
        });
      } else if (branchSlug && categorySlug) {
        const response = await axiosInstance.get(`/product/get_by_category/${branchSlug}/${categorySlug}?page=${fetchPage}&perPage=10`, { signal });
        setHasNextPage(response.data.data.next_page_url !== null);
        setProducts((prevProducts) => {
          return [...new Set([...prevProducts, ...response.data.data.data])];
        });
      } else if (branchSlug) {
        const response = await axiosInstance.get(`/product/get_by_branch/${branchSlug}?page=${fetchPage}&perPage=10`, { signal });
        setHasNextPage(response.data.data.next_page_url !== null);
        setProducts((prevProducts) => {
          return [...new Set([...prevProducts, ...response.data.data.data])];
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setPage(1);
    setProducts([]);
    setHasNextPage(true);

    fetchData(signal, 1);

    return () => controller.abort();
  }, [branchSlug, categorySlug, subCategorySlug, isLoggedIn]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (page > 1) {
      fetchData(signal, page);
    }

    return () => controller.abort();
  }, [page]);

  const isProductBookmarked = (productId) => {
    return userBookmarks.some((bookmark) => bookmark.pivot.product_id === productId);
  };

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const { signal } = controller;

  //   setPage(1);
  //   setProducts([]);
  //   setHasNextPage(true);

  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       if (branchSlug && categorySlug && subCategorySlug) {
  //         const response = await axiosInstance.get(`/product/get_by_subcategory/${branchSlug}/${categorySlug}/${subCategorySlug}?page=${page}&perPage=10`, { signal });
  //         setHasNextPage(response.data.data.next_page_url !== null);
  //         setProducts((prevProducts) => {
  //           return [...new Set([...prevProducts, ...response.data.data.data])];
  //         });
  //       } else if (branchSlug && categorySlug) {
  //         const response = await axiosInstance.get(`/product/get_by_category/${branchSlug}/${categorySlug}?page=${page}&perPage=10`, { signal });
  //         setHasNextPage(response.data.data.next_page_url !== null);
  //         setProducts((prevProducts) => {
  //           return [...new Set([...prevProducts, ...response.data.data.data])];
  //         });
  //       } else if (branchSlug) {
  //         const response = await axiosInstance.get(`/product/get_by_branch/${branchSlug}?page=${page}&perPage=10`, { signal });
  //         setHasNextPage(response.data.data.next_page_url !== null);
  //         setProducts((prevProducts) => {
  //           return [...new Set([...prevProducts, ...response.data.data.data])];
  //         });
  //       }

  //       if (isLoggedIn) {
  //         const response = await axiosInstance.get("/bookmark", {
  //           headers: {
  //             Authorization: `Bearer ${cookie.get("access_token")}`,
  //           },
  //         });
  //         setUserBookmarks(response.data.data);
  //       }
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData(signal);

  //   return () => controller.abort();
  // }, [branchSlug, categorySlug, subCategorySlug, isLoggedIn]);

  return (
    <SidebarBranchLayout>
      <div className="mx-4 my-16 pt-7 md:pt-0 md:m-16">
        {/* filter */}
        <div className=" bg-gray mb-6 py-3 px-3 flex flex-wrap gap-6 justify-center md:justify-between items-center">
          <select defaultValue="" className="order-2 md:order-1 bg-gray py-2 px-3 border border-white/20 rounded-lg focus:ring-primary focus:border-primary block">
            <option value="" disabled>
              Harga
            </option>
            <option value="asc">Rendah ke Tinggi</option>
            <option value="desc">Tinggi ke Rendah</option>
          </select>

          <div className="relative order-1 md:order-2 mt-4 sm:mt-0">
            <input className="bg-white text-dark py-2 px-3 rounded-lg pl-11" type="text" placeholder="Search" />
            <i className="absolute fa-solid text-dark fa-magnifying-glass left-3 top-1/2 -translate-y-1/2"></i>
          </div>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 ">
          {products.length > 0 ? (
            products.map((product, index) => (
              <React.Fragment key={product.id}>
                <CardProduct key={product.id} isBookmarked={isProductBookmarked(product.id)} productId={product.id} image={product.thumbnail} stock={product.is_stock} branch={product.branch.name} price={product.price} to={product.slug}>
                  {product.name}
                </CardProduct>
                {index === products.length - 1 && <div ref={listEndRef}></div>}
              </React.Fragment>
            ))
          ) : isLoading ? (
            <CardSkeleton count={3} />
          ) : (
            <ProductNotFound />
          )}
          {isLoading && <CardSkeleton count={3} />}
        </div>
      </div>
    </SidebarBranchLayout>
  );
};

export default BranchPage;
