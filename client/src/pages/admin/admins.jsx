import { Button, Modal } from "flowbite-react";
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { AppContext } from "../../context/AppContext";

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

const AdminsPage = () => {
  const cookie = new Cookies();
  const [admins, setAdmins] = useState();
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { branchs } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");

  const getAdmin = async () => {
    try {
      const response = await axiosInstance.get(`/admin`, {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token_admin")}`,
          "Content-Type": "Application/json",
        },
      });
      setAdmins(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const handleCloseModalCreate = () => {
    setOpenModalCreate(false);
    setEmail("");
    setPassword("");
    setRole("");
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axiosInstance.post(
          "/admin",
          {
            email,
            password,
            role,
            branch_id: branch,
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
          success: "Berhasil menambah admin",
          error: "Gagal menambah admin",
        }
      );
      setAdmins((prev) => [response.data.data, ...prev]);
      handleCloseModalCreate();
    } catch (error) {}
  };

  const handleCloseModalUpdate = () => {
    setOpenModalUpdate(false);

    setEmail("");
    setPassword("");
    setRole("");
    setSelectedAdmin(null);
  };

  const handleOpenModalUpdate = (admin) => {
    setSelectedAdmin(admin);
    setOpenModalUpdate(true);

    if (admin) {
      setEmail(admin.email);
      setPassword(admin.password);
      setRole(admin.role);
    }
  };

  const handleUpdateAdmin = async (e, id) => {
    e.preventDefault();

    try {
      const response = await toast.promise(
        axiosInstance.post(
          `/admin/${id}`,
          {
            email,
            password,
            role,
            branch_id: branch,
          },
          {
            headers: {
              Authorization: `Bearer ${cookie.get("access_token_admin")}`,
              "X-HTTP-Method-Override": "PUT",
            },
          }
        ),
        {
          loading: "Saving...",
          success: "Berhasil update admin",
          error: "Gagal update admin",
        }
      );
      setAdmins((prev) => prev.map((admin) => (admin.id === response.data.data.id ? response.data.data : admin)));
      handleCloseModalUpdate();
    } catch (error) {}
  };

  const handleOpenModalDelete = (admin) => {
    setSelectedAdmin(admin);
    setOpenModalDelete(true);
  };

  const handleCloseModalDelete = () => {
    setSelectedAdmin(null);
    setOpenModalDelete(false);
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await toast.promise(
        axiosInstance.delete(`/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token_admin")}`,
          },
        }),
        {
          loading: "Saving...",
          success: "Berhasil hapus admin",
          error: "Gagal hapus admin",
        }
      );
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
      handleCloseModalDelete();
    } catch (error) {}
  };

  return (
    <LayoutAdmin>
      <div className="mb-5">
        <Button onClick={() => setOpenModalCreate(true)}>
          <HiOutlinePlus className="mr-3 h-4 w-4" />
          Tambah Admin
        </Button>
      </div>

      <div className="relative overflow-x-auto ">
        <table className="text-sm text-left rtl:text-right shadow-lg">
          <thead className="text-xs text-gray uppercase bg-slate-200 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Cabang
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {admins &&
              admins.map((admin) => (
                <tr key={admin.id} className="bg-white border-b border-slate-200">
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">{admin.role}</td>
                  <td className="px-6 py-4">{admin.role == "admin" ? admin?.branch?.name : "-"}</td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <HiOutlinePencilAlt onClick={() => handleOpenModalUpdate(admin)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                      <HiOutlineTrash onClick={() => handleOpenModalDelete(admin)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* modal create */}
      <Modal show={openModalCreate} onClose={handleCloseModalCreate} size="md" popup theme={customThemeModal}>
        <form onSubmit={(e) => handleCreateAdmin(e)}>
          <Modal.Header className="text-gray" />
          <Modal.Body className="text-gray">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Masukan email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    id="password"
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Masukan password"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray">
                    Role
                  </label>
                  <select id="role" defaultValue="" onChange={(e) => setRole(e.target.value)} className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                    <option disabled value="">
                      Pilih Role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="super admin">Super Admin</option>
                  </select>
                </div>
                {role == "admin" && (
                  <div>
                    <label htmlFor="branch_id" className="block mb-2 text-sm font-medium text-gray">
                      Cabang
                    </label>
                    <select id="branch_id" defaultValue="" onChange={(e) => setBranch(e.target.value)} className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                      <option disabled value="">
                        Pilih Cabang
                      </option>
                      {branchs && branchs.map((branch) => <option value={branch.id}>{branch.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-red-500 hover:!bg-red-600">
              Tambah Admin
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* modal update */}
      <Modal show={openModalUpdate} onClose={handleCloseModalUpdate} size="md" popup theme={customThemeModal}>
        <form onSubmit={(e) => handleUpdateAdmin(e, selectedAdmin?.id)}>
          <Modal.Header className="text-gray" />
          <Modal.Body className="text-gray">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    defaultValue={selectedAdmin?.email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Masukan email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    id="password"
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Masukan password"
                  />
                </div>
                <div>
                  <label htmlFor="branch_id" className="block mb-2 text-sm font-medium text-gray">
                    Role
                  </label>
                  <select
                    id="branch_id"
                    defaultValue={selectedAdmin?.role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  >
                    <option disabled value="">
                      Pilih Role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="super admin">Super Admin</option>
                  </select>
                </div>
                {(selectedAdmin?.role == "admin" || role == "admin") && (
                  <div>
                    <label htmlFor="branch_id" className="block mb-2 text-sm font-medium text-gray">
                      Cabang
                    </label>
                    <select
                      id="branch_id"
                      defaultValue={selectedAdmin?.branch?.id}
                      onChange={(e) => setBranch(e.target.value)}
                      className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    >
                      <option disabled value="">
                        Pilih Cabang
                      </option>
                      {branchs && branchs.map((branch) => <option value={branch.id}>{branch.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-red-500 hover:!bg-red-600">
              Update Admin
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
              Apakah yakin ingin menghapus <br /> <strong>{selectedAdmin?.email}</strong> ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteAdmin(selectedAdmin?.id)}>
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

export default AdminsPage;
