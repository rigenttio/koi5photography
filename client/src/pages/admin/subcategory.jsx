import { Button, Modal } from "flowbite-react";
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

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

const SubCategoryPage = () => {
  const cookie = new Cookies();
  const [subCategories, setSubCategories] = useState();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [name, setName] = useState("");

  const getSubCategory = async () => {
    try {
      const response = await axiosInstance.get(`/subcategory`);
      setSubCategories(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getSubCategory();
  }, []);

  const handleCloseModalCreate = () => {
    setOpenModalCreate(false);
    setName("");
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axiosInstance.post(
          "/subcategory",
          {
            name,
          },
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token_admin")}`,
              "Content-Type": "Application/json",
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil menambah kategori",
          error: "Gagal menambah kategori",
        }
      );
      setSubCategories((prev) => [response.data.data, ...prev]);
      handleCloseModalCreate();
    } catch (error) {}
  };

  const handleCloseModalUpdate = () => {
    setOpenModalUpdate(false);

    setName("");
    setSelectedSubCategory(null);
  };

  const handleOpenModalUpdate = (category) => {
    setSelectedSubCategory(category);
    setOpenModalUpdate(true);

    if (category) {
      setName(category.name);
    }
  };

  const handleUpdateSubCategory = async (e, id) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axiosInstance.post(
          `/subcategory/${id}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token_admin")}`,
              "X-HTTP-Method-Override": "PUT",
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil update kategori",
          error: "Gagal update kategori",
        }
      );
      setSubCategories((prev) => prev.map((subcategory) => (subcategory.id === response.data.data.id ? response.data.data : subcategory)));
      handleCloseModalUpdate();
    } catch (error) {}
  };

  const handleOpenModalDelete = (subcategory) => {
    setSelectedSubCategory(subcategory);
    setOpenModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setSelectedSubCategory(null);
    setOpenModalDelete(false);
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await toast.promise(
        axiosInstance.delete(`/subcategory/${id}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token_admin")}`,
          },
        }),
        {
          loading: "Saving...",
          success: "Berhasil hapus Kategori",
          error: "Gagal hapus Kategori",
        }
      );
      setSubCategories((prev) => prev.filter((categories) => categories.id !== id));
      handleCloseModalDelete();
    } catch (error) {}
  };

  return (
    <LayoutAdmin>
      <div className="mb-5">
        <Button onClick={() => setOpenModalCreate(true)}>
          <HiOutlinePlus className="mr-3 h-4 w-4" />
          Tambah Sub Kategori
        </Button>
      </div>

      <div className="relative overflow-x-auto ">
        <table className="text-sm text-left rtl:text-right shadow-lg">
          <thead className="text-xs text-gray uppercase bg-slate-200 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama Sub Kategori
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {subCategories &&
              subCategories.map((category) => (
                <tr key={category.id} className="bg-white border-b border-slate-200">
                  <td className="px-6 py-4">{category.name}</td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <HiOutlinePencilAlt onClick={() => handleOpenModalUpdate(category)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                      <HiOutlineTrash onClick={() => handleOpenModalDelete(category)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* modal create */}
      <Modal show={openModalCreate} onClose={handleCloseModalCreate} size="md" popup theme={customThemeModal}>
        <form onSubmit={(e) => handleCreateSubCategory(e)}>
          <Modal.Header className="text-gray" />
          <Modal.Body className="text-gray">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nama Sub Kategori
                  </label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    id="name_create"
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Masukan nama sub kategori"
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-red-500 hover:!bg-red-600">
              Tambah Sub Kategori
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* modal update */}
      <Modal show={openModalUpdate} onClose={handleCloseModalUpdate} size="md" popup theme={customThemeModal}>
        <form onSubmit={(e) => handleUpdateSubCategory(e, selectedSubCategory?.id)}>
          <Modal.Header className="text-gray" />
          <Modal.Body className="text-gray">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name_create" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nama Sub Kategori
                  </label>
                  <input
                    defaultValue={selectedSubCategory?.name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    id="name_create"
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Masukan nama sub kategori"
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-red-500 hover:!bg-red-600">
              Update Sub Kategori
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
              Apakah yakin ingin menghapus <br /> <strong>{selectedSubCategory?.name}</strong> ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteSubCategory(selectedSubCategory?.id)}>
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

export default SubCategoryPage;
