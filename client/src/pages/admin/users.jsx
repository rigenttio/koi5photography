import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import Spinner from "../../components/Fragments/Loading/Spinner";
import { Button, Modal, Pagination } from "flowbite-react";
import { HiOutlineTrash, HiOutlinePencilAlt, HiOutlineExclamationCircle } from "react-icons/hi";
import Cookies from "universal-cookie";
import { axiosInstance } from "../../lib/axios";
import InputForm from "../../components/Elements/Input";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import toast from "react-hot-toast";

const customThemeModal = {
  root: {
    show: {
      on: "flex bg-black bg-opacity-50 dark:bg-opacity-80",
      off: "hidden",
    },
  },
};

const UsersPage = () => {
  const cookie = new Cookies();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [noTlp, setNoTlp] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const { handleUpdateUser } = useUpdateUser(firstName, lastName, noTlp, address, email);

  const getUsers = async (page) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/user?page=${page}&perPage=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token_admin")}`,
        },
      });
      setUsers(response.data.data.data);
      setTotalPages(response.data.data.last_page);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    getUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);

    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setNoTlp(user.no_tlp);
      setAddress(user.address);
      setEmail(user.email);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(false);

    setFirstName("");
    setLastName("");
    setNoTlp("");
    setAddress("");
    setEmail("");
  };

  const updateUser = async (id, e) => {
    try {
      await handleUpdateUser(id, e);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id
            ? {
                ...user,
                first_name: firstName,
                last_name: lastName,
                no_tlp: noTlp,
                address: address,
                email: email,
              }
            : user
        )
      );
      handleCloseModal();
    } catch (error) {}
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
    setOpenPopup(false);
  };

  const handleOpenPopup = (user) => {
    setSelectedUser(user);
    setOpenPopup(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await toast.promise(
        axiosInstance.delete(`/user/${id}`, {
          headers: {
            Authorization: `Bearer ${cookie.get("access_token_admin")}`,
          },
        }),
        {
          loading: "Saving...",
          success: "Berhasil hapus user",
          error: "Gagal hapus user",
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      handleClosePopup();
    } catch (error) {}
  };

  const handleSearch = () => {
    getUsers(1);
  };

  return (
    <LayoutAdmin>
      <div className="relative mb-5">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input
          type="text"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Cari nama pengguna"
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

      <div className="relative overflow-x-auto shadow-lg">
        <table className="w-full text-sm text-left rtl:text-right ">
          <thead className="text-xs text-gray uppercase bg-slate-200 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama Depan
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Belakang
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                No. Tlp
              </th>
              <th scope="col" className="px-6 py-3">
                Alamat Lengkap
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
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="bg-white border-b border-slate-200">
                    <td className="px-6 py-4">{user.first_name}</td>
                    <td className="px-6 py-4">{user.last_name}</td>
                    <td className="px-6 py-4">{user.email}</td>

                    <td className="px-6 py-4 whitespace-nowrap">{user.no_tlp}</td>
                    <td className="px-6 py-4">{user.address}</td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <HiOutlinePencilAlt onClick={() => handleOpenModal(user)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                        <HiOutlineTrash onClick={() => handleOpenPopup(user)} className="w-6 h-6 cursor-pointer text-gray hover:text-gray/40" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b border-slate-200">
                  <td colSpan="6" className="px-6 py-4">
                    <div className="text-center">Data Pengguna Kosong</div>
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

      {/* update modal */}
      <Modal show={openModal} size="md" popup onClose={handleCloseModal} theme={customThemeModal}>
        <form onSubmit={(e) => updateUser(selectedUser?.id, e)}>
          <Modal.Header className="text-gray" />
          <Modal.Body className="text-gray">
            <div className="flex flex-col w-full gap-6 py-6">
              <div className="flex gap-6">
                <div className="flex flex-col w-full gap-6">
                  <InputForm defaultValue={selectedUser?.first_name} onChange={(e) => setFirstName(e.target.value)} image="/assets/icons/user-input.svg" type="text" placeholder="Nama Depan" name="first_name" />
                </div>
                <div className="flex flex-col w-full gap-6">
                  <InputForm defaultValue={selectedUser?.last_name} onChange={(e) => setLastName(e.target.value)} image="/assets/icons/user-input.svg" type="text" placeholder="Nama Belakang" name="last_name" />
                </div>
              </div>
              <InputForm defaultValue={selectedUser?.email} image="/assets/icons/email-input.svg" type="email" placeholder="Email" name="email" />
              <InputForm defaultValue={selectedUser?.no_tlp} onChange={(e) => setNoTlp(e.target.value)} image="/assets/icons/tlp-input.svg" type="tel" placeholder="No. Telephone" name="no_tlp" />

              <InputForm defaultValue={selectedUser?.address} onChange={(e) => setAddress(e.target.value)} image="/assets/icons/address-input.svg" type="text" placeholder="Alamat Lengkap" name="address" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-red-500 hover:!bg-red-600">
              Update User
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* pop up delete modal */}
      <Modal show={openPopup} size="md" onClose={handleClosePopup} popup theme={customThemeModal}>
        <Modal.Header className="text-gray" />
        <Modal.Body className="text-gray">
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Apakah yakin ingin menghapus {selectedUser?.first_name} {selectedUser?.last_name}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteUser(selectedUser?.id)}>
                Hapus
              </Button>
              <Button color="gray" onClick={handleClosePopup}>
                Kembali
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </LayoutAdmin>
  );
};

export default UsersPage;
