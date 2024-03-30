import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";

const DropdownNavbar = (props) => {
  const { children } = props;
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [branch, setBranch] = useState();
  const location = useLocation();

  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  useEffect(() => {
    const getBranch = async () => {
      try {
        const response = await axiosInstance.get("/branch");
        setBranch(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBranch();
  }, []);

  return (
    <div>
      <div className="relative">
        <div onClick={toggleDropdown} className="flex items-center gap-2 cursor-pointer">
          <span className="font-bold text-lg">{children}</span>
          <img src="/assets/icons/dropdown.svg" alt="" className={`transition-transform duration-500 ${isOpenDropdown && "rotate-180"}`} />
        </div>
        {isOpenDropdown && (
          <div className="lg:absolute min-w-56 bg-gray rounded-lg lg:rounded-3xl py-2 md:py-6 top-10 -left-[30%]">
            {branch &&
              branch.map((bran) => (
                <Link
                  to={`/catalog/${bran.slug}`}
                  key={bran.id}
                  onClick={() => {
                    setIsOpenDropdown(false);
                  }}
                  className={`md:py-[10px] py-2 px-4 md:px-6 inline-block w-full whitespace-nowrap hover:underline ${location.pathname.includes(bran.slug) && "underline"}`}
                >
                  {bran.name}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownNavbar;
