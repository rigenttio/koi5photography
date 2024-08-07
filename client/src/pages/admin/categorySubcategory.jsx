import { Button, Checkbox, Table } from "flowbite-react";
import LayoutAdmin from "../../components/Layouts/LayoutAdmin";
import { axiosInstance } from "../../lib/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

const CategorySubCategoryPage = () => {
  const cookie = new Cookies();
  const [categories, setCategories] = useState();
  const [subCategories, setSubCategories] = useState();
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const getCategory = async () => {
    try {
      const response = await axiosInstance.get(`/category`);
      setCategories(response.data.data);
    } catch (error) {}
  };

  const getSubCategory = async () => {
    try {
      const response = await axiosInstance.get(`/subcategory`);
      setSubCategories(response.data.data);
    } catch (error) {}
  };

  const getCategorySubCategories = async (categoryId) => {
    try {
      const response = await axiosInstance.get(`/subcategories?category_id=${categoryId}`);
      setSelectedSubCategories(response.data.data.map((category) => category.id));
    } catch (error) {}
  };

  useEffect(() => {
    getCategory();
    getSubCategory();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(categoryId);
    getCategorySubCategories(categoryId);
  };

  const handleSubCategoryChange = (categoryId) => {
    setSelectedSubCategories((prevSelected) => (prevSelected.includes(categoryId) ? prevSelected.filter((id) => id !== categoryId) : [...prevSelected, categoryId]));
  };

  const saveCategorySubCategories = async () => {
    try {
      const response = await toast.promise(
        axiosInstance.post(
          `/categories/${selectedCategories}/subcategories`,
          {
            subcategory_ids: selectedSubCategories,
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
          Kategori
        </label>
        <div className="mb-5 flex gap-8">
          <div>
            <select id="branch_id" onChange={(e) => handleCategoryChange(e.target.value)} defaultValue="" className="bg-white border border-gray text-gray text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
              <option disabled value="">
                Pilih kategori
              </option>
              {categories &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <Button onClick={saveCategorySubCategories} className="bg-red-500 hover:!bg-red-600">
            Simpan
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head className="bg-neutral-200">
              <Table.HeadCell className="p-4"></Table.HeadCell>
              <Table.HeadCell>Sub Kategori</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {subCategories &&
                subCategories.map((category) => (
                  <Table.Row key={category.id} className="bg-white">
                    <Table.Cell className="p-4">
                      <Checkbox disabled={!selectedCategories} checked={selectedSubCategories.includes(category.id)} onChange={() => handleSubCategoryChange(category.id)} />
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

export default CategorySubCategoryPage;
