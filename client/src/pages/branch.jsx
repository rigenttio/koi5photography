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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
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
        const response = await axiosInstance.get(`/product/get_by_subcategory/${branchSlug}/${categorySlug}/${subCategorySlug}?page=${fetchPage}&perPage=10&search=${search}&sort=${sort}`, { signal });
        setHasNextPage(response.data.data.next_page_url !== null);
        setProducts((prevProducts) => {
          return [...new Set([...prevProducts, ...response.data.data.data])];
        });
      } else if (branchSlug && categorySlug) {
        const response = await axiosInstance.get(`/product/get_by_category/${branchSlug}/${categorySlug}?page=${fetchPage}&perPage=10&search=${search}&sort=${sort}`, { signal });
        setHasNextPage(response.data.data.next_page_url !== null);
        setProducts((prevProducts) => {
          return [...new Set([...prevProducts, ...response.data.data.data])];
        });
      } else if (branchSlug) {
        const response = await axiosInstance.get(`/product/get_by_branch/${branchSlug}?page=${fetchPage}&perPage=10&search=${search}&sort=${sort}`, { signal });
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
    setSearch("");
    setHasNextPage(true);

    fetchData(signal, 1);

    return () => controller.abort();
  }, [branchSlug, categorySlug, subCategorySlug, isLoggedIn, sort]);

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

  const handleSearch = () => {
    const controller = new AbortController();
    const { signal } = controller;

    setPage(1);
    setProducts([]);

    fetchData(signal, 1);
    return () => controller.abort();
  };

  return (
    <SidebarBranchLayout>
      <div className="mx-4 my-16 pt-7 md:pt-0 md:m-16">
        {/* filter */}
        <div className=" bg-gray mb-6 py-3 px-3 flex flex-wrap gap-6 justify-center md:justify-between items-center">
          <select defaultValue="" onChange={(e) => setSort(e.target.value)} className="order-2 md:order-1 bg-gray py-2 px-3 border border-white/20 rounded-lg focus:ring-primary focus:border-primary block">
            <option value="" disabled>
              Harga
            </option>
            <option value="asc">Rendah ke Tinggi</option>
            <option value="desc">Tinggi ke Rendah</option>
          </select>

          <div className="relative order-1 md:order-2 mt-4 sm:mt-0 min-w-96">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="text"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Cari produk"
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
