import { Button, Checkbox, Table } from "flowbite-react";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import { axiosInstance } from "../../lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

const BranchCategoryPage = () => {
  const cookie = new Cookies();
  const [branches, setBranches] = useState();
  const [categories, setCategories] = useState();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const getBranches = async () => {
    try {
      const response = await axiosInstance.get(`/branches`);
      setBranches(response.data.data);
    } catch (error) {}
  };

  const getCategory = async () => {
    try {
      const response = await axiosInstance.get(`/category`);
      setCategories(response.data.data);
    } catch (error) {}
  };

  const getBranchCategories = async (branchId) => {
    try {
      const response = await axiosInstance.get(`/categories?branch_id=${branchId}`);
      setSelectedCategories(response.data.data.map((category) => category.id));
    } catch (error) {}
  };

  useEffect(() => {
    getBranches();
    getCategory();
  }, []);

  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId);
    getBranchCategories(branchId);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => (prevSelected.includes(categoryId) ? prevSelected.filter((id) => id !== categoryId) : [...prevSelected, categoryId]));
  };

  const saveBranchCategories = async () => {
    try {
      const response = await toast.promise(
        axiosInstance.post(
          `/branches/${selectedBranch}/categories`,
          {
            category_ids: selectedCategories,
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
          success: "Berhasil",
          error: "Gagal",
        }
      );
    } catch (error) {}
  };

  return (
    <LayoutAdmin>
      <div>
        <label htmlFor="branch_id" className="block mb-2 text-sm font-bold text-gray">
          Cabang
        </label>
        <div className="mb-5 flex gap-8">
          <div>
            <select id="branch_id" onChange={(e) => handleBranchChange(e.target.value)} defaultValue="" className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
              <option disabled value="">
                Pilih cabang
              </option>
              {branches &&
                branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
            </select>
          </div>
          <Button onClick={saveBranchCategories} className="bg-red-500 hover:!bg-red-600">
            Simpan
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head className="bg-neutral-200">
              <Table.HeadCell className="p-4"></Table.HeadCell>
              <Table.HeadCell>Kategori</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {categories &&
                categories.map((category) => (
                  <Table.Row key={category.id} className="bg-white">
                    <Table.Cell className="p-4">
                      <Checkbox disabled={!selectedBranch} checked={selectedCategories.includes(category.id)} onChange={() => handleCategoryChange(category.id)} />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">{category.name}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </LayoutAdmin>
  );
};

export default BranchCategoryPage;
