import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "../Accordion";
import { Link, useLocation, useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import Skeleton from "react-loading-skeleton";

const SidebarBranch = () => {
  const { branchSlug } = useParams();
  const [category, setCategory] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axiosInstance.get(`/category/${branchSlug}`);
        setCategory(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getCategory();
  }, [branchSlug]);

  return (
    <aside className="w-72 overflow-y-auto pr-6 py-6 pl-8 h-[84vh] bg-gradient-to-t from-gray to-transparent">
      {isLoading ? (
        <Skeleton count={12} />
      ) : (
        <Accordion className="flex flex-col gap-2">
          {category &&
            category.map((categ) =>
              categ.subcategories.length > 0 ? (
                <AccordionItem key={categ.id} value={categ.id + branchSlug} trigger={categ.name}>
                  {categ.subcategories.map((subcategory) => (
                    <Link to={`/catalog/${branchSlug}/${categ.slug}/${subcategory.slug}`} className={`hover:underline`} key={subcategory.id}>
                      {subcategory.name}
                    </Link>
                  ))}
                </AccordionItem>
              ) : (
                <Link to={`/catalog/${branchSlug}/${categ.slug}`} title={categ.name} className={`hover:underline truncate ${location.pathname.includes(categ.slug) && "underline"}`} key={categ.id}>
                  {categ.name}
                </Link>
              )
            )}
        </Accordion>
      )}
    </aside>
  );
};

export default SidebarBranch;
