import React, { useContext, useEffect, useState } from "react";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import { HiOutlineTrash, HiOutlinePencilAlt, HiOutlinePlus, HiOutlineExclamationCircle } from "react-icons/hi";
import Cookies from "universal-cookie";
import { axiosInstance } from "../../lib/axios";
import Spinner from "../../components/Fragments/Loading/Spinner";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Button, Modal, Pagination } from "flowbite-react";
import ToggleStock from "../../components/Elements/Toggle/ToggleStock";
import { AppContext } from "../../context/AppContext";
import { useProduct } from "../../hooks/useProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import toast from "react-hot-toast";
import { useAdminAuth } from "../../context/AdminAuthContext";

const customThemeModal = {
  root: {
    show: {
      on: "flex bg-black bg-opacity-50 dark:bg-opacity-80",
      off: "hidden",
    },
    sizes: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    },
    positions: {
      "top-left": "items-start justify-start",
      "top-center": "items-start justify-center",
      "top-right": "items-start justify-end",
      "center-left": "items-center justify-start",
      center: "items-center justify-center",
      "center-right": "items-center justify-end",
      "bottom-right": "items-end justify-end",
      "bottom-center": "items-end justify-center",
      "bottom-left": "items-end justify-start",
    },
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner: "relative flex max-h-[90dvh] overflow-auto flex-col rounded-lg bg-white shadow dark:bg-gray-700",
  },
};

const ProductAdminPage = () => {
  const cookie = new Cookies();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { branchs } = useContext(AppContext);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [branch_id, setBranch_id] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [subCategory_id, setSubCategory_id] = useState("");

  const { handleProduct } = useProduct(branch_id, category_id, subCategory_id, name, description, price, thumbnail);
  const { handleUpdateProduct } = useUpdateProduct(name, description, price, thumbnail);
  const { authUser } = useAdminAuth();

  const getProducts = async (page) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/product?page=${page}&perPage=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token_admin")}`,
        },
      });
      setProducts(response.data.data.data);
      setTotalPages(response.data.data.last_page);
      setIsLoading(false);
    } catch (error) {}
  };

  const getProductbyBranch = async (page) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/product/get_by_branch/${authUser.branch.slug}?page=${page}&perPage=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token_admin")}`,
        },
      });
      setProducts(response.data.data.data);
      setTotalPages(response.data.data.last_page);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    {
      authUser.role == "admin" ? getProductbyBranch(currentPage) : getProducts(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    getProducts(1);
  };

  const handleOpenModalCreate = () => {
    setOpenModalCreate(true);
  };

  const handleCloseModalCreate = () => {
    setOpenModalCreate(false);

    setName("");
    setDescription("");
    setPrice(null);
    setThumbnail("");
    setBranch_id("");
    setCategory_id("");
    setSubCategory_id("");

    setCategories([]);
    setSubCategories([]);
  };

  const handleBranchChange = async (branchId) => {
    setBranch_id(branchId);
    try {
      const response = await axiosInstance.get(`/categories?branch_id=${branchId}`);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setCategory_id(categoryId);
    try {
      const response = await axiosInstance.get(`/subcategories?category_id=${categoryId}`);
      setSubCategories(response.data.data);

      if (response.data.data.length === 0) {
        setSubCategory_id("");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubmitProduct = async (e) => {
    try {
      const newProduct = await handleProduct(e);
      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      handleCloseModalCreate();
    } catch (error) {}
  };

  const handleOpenModalUpdate = (product) => {
    setSelectedProduct(product);
    setOpenModalUpdate(true);

    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
    }
  };

  const handleCloseModalUpdate = () => {
    setOpenModalUpdate(false);

    setName("");
    setDescription("");
    setPrice(null);
    setThumbnail("");
    setBranch_id("");
    setCategory_id("");
    setSubCategory_id("");

    setSelectedProduct(null);
  };

  const handleSubmitUpdateProduct = async (id, e) => {
    try {
      await handleUpdateProduct(id, e);
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                name: name,
                description: description,
                price: price,
              }
            : product
        )
      );
      handleCloseModalUpdate();
    } catch (error) {}
  };

  const handleOpenModalDelete = (product) => {
    setSelectedProduct(product);
    setOpenModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setSelectedProduct(null);
    setOpenModalDelete(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await toast.promise(
        axiosInstance.delete(`/product/${id}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token_admin")}`,
          },
        }),
        {
          loading: "Saving...",
          success: "Berhasil hapus produk",
          error: "Gagal hapus produk",
        }
      );
      setProducts((prev) => prev.filter((product) => product.id !== id));
      handleCloseModalDelete();
    } catch (error) {}
  };

  return (
    <LayoutAdmin>
      <div className="mb-5 flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="text"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary"
            placeholder="Cari nama produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" onClick={handleSearch} className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary/50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ">
            Search
          </button>
        </div>
        <div className="w-full">
          <div className="flex justify-end">
            <Button onClick={handleOpenModalCreate}>
              <HiOutlinePlus className="mr-3 h-4 w-4" />
              Tambah Produk
            </Button>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-lg">
        <table className="w-full text-sm text-left rtl:text-right ">
          <thead className="text-xs text-gray uppercase bg-slate-200 ">
            <tr>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Nama Produk
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Cabang
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Harga
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Deskripsi
              </th>
              <th scope="col" className="px-6 py-3 whitespace-nowrap">
                Ketersediaan
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
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="bg-white border-b border-slate-200">
                    <td className="px-6 py-4 ">
                      <p className="line-clamp-2">{product.name}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.branch.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <FormatRupiah value={product.price} />
                    </td>

                    <td className="px-6 py-4 ">
                      <p className="line-clamp-3">{product.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <ToggleStock is_stock={product.is_stock} productId={product.id} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <HiOutlinePencilAlt onClick={() => handleOpenModalUpdate(product)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                        <HiOutlineTrash onClick={() => handleOpenModalDelete(product)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b border-slate-200">
                  <td colSpan="6" className="px-6 py-4">
                    <div className="text-center">Data Produk Kosong</div>
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

      {/* modal create */}
      <Modal show={openModalCreate} size="md" popup onClose={handleCloseModalCreate} theme={customThemeModal}>
        <form onSubmit={(e) => handleSubmitProduct(e)}>
          <Modal.Header className="text-gray" />
          <Modal.Body className="text-gray">
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label htmlFor="branch_id" className="block mb-2 text-sm font-medium text-gray">
                  Cabang
                </label>
                <select id="branch_id" onChange={(e) => handleBranchChange(e.target.value)} defaultValue="" className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                  <option disabled value="">
                    Pilih cabang
                  </option>
                  {branchs &&
                    branchs.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                </select>
              </div>
              {categories && categories.length > 0 && (
                <div>
                  <label htmlFor="category_id" className="block mb-2 text-sm font-medium text-gray">
                    Kategori
                  </label>
                  <select
                    id="category_id"
                    defaultValue=""
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option disabled value="">
                      Pilih kategori
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {subCategories && subCategories.length > 0 && (
                <div>
                  <label htmlFor="subcategory_id" className="block mb-2 text-sm font-medium text-gray">
                    Sub Kategori
                  </label>
                  <select
                    id="subcategory_id"
                    defaultValue=""
                    onChange={(e) => setSubCategory_id(e.target.value)}
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option disabled value="">
                      Pilih sub kategori
                    </option>
                    {subCategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nama Produk
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  id="name_create"
                  className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan nama produk"
                />
              </div>
              <div>
                <label htmlFor="description_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Deskripsi
                </label>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  id="description_create"
                  cols="30"
                  rows="5"
                  placeholder="Masukan deskripsi"
                  className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                ></textarea>
              </div>
              <div>
                <label htmlFor="harga_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Harga
                </label>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  type="text"
                  id="harga_create"
                  className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan harga produk"
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">Thumbnail</label>
                <input
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  type="file"
                  className="w-full rounded-md border border-gray p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-gray file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary "
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-red-500 hover:!bg-red-600">
              Tambah Produk
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* modal update */}
      <Modal show={openModalUpdate} size="md" popup onClose={handleCloseModalUpdate} theme={customThemeModal}>
        <form onSubmit={(e) => handleSubmitUpdateProduct(selectedProduct?.id, e)}>
          <Modal.Header className="text-gray" />
          <Modal.Body className="text-gray">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nama Produk
                </label>
                <input
                  defaultValue={selectedProduct?.name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  id="name_create"
                  className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan nama produk"
                />
              </div>
              <div>
                <label htmlFor="description_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Deskripsi
                </label>
                <textarea
                  defaultValue={selectedProduct?.description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description_create"
                  cols="30"
                  rows="5"
                  placeholder="Masukan deskripsi"
                  className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                ></textarea>
              </div>
              <div>
                <label htmlFor="harga_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Harga
                </label>
                <input
                  defaultValue={selectedProduct?.price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="text"
                  id="harga_create"
                  className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Masukan harga produk"
                />
              </div>
              <div>
                <label className="mb-3 block text-black dark:text-white">Thumbnail</label>
                <input
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  type="file"
                  className="w-full rounded-md border border-gray p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-gray file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary "
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-red-500 hover:!bg-red-600">
              Update Produk
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* modal delete */}
      <Modal show={openModalDelete} size="md" onClose={handleCloseModalDelete} popup theme={customThemeModal}>
        <Modal.Header className="text-gray" />
        <Modal.Body className="text-gray">
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Apakah yakin ingin menghapus <br /> <strong>{selectedProduct?.name}</strong> ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteProduct(selectedProduct?.id)}>
                Hapus
              </Button>
              <Button color="gray" onClick={handleCloseModalDelete}>
                Kembali
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </LayoutAdmin>
  );
};

export default ProductAdminPage;
