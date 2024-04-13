import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import { AppContext } from "../../../context/AppContext";

const DropdownNavbar = (props) => {
  const { children } = props;
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const { branchs } = useContext(AppContext);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  return (
    <div>
      <div className="relative">
        <div onClick={toggleDropdown} className="flex items-center gap-2 cursor-pointer">
          <span className="font-bold text-lg">{children}</span>
          <img src="/assets/icons/dropdown.svg" alt="" className={`transition-transform duration-500 ${isOpenDropdown && "rotate-180"}`} />
        </div>
        {isOpenDropdown && (
          <div className="lg:absolute min-w-56 bg-gray rounded-lg lg:rounded-3xl py-2 md:py-6 top-10 -left-[30%]">
            {branchs &&
              branchs.map((branch) => (
                <Link
                  to={`/catalog/${branch.slug}`}
                  key={branch.id}
                  onClick={() => {
                    setIsOpenDropdown(false);
                  }}
                  className={`md:py-[10px] py-2 px-4 md:px-6 inline-block w-full whitespace-nowrap hover:underline ${location.pathname.includes(branch.slug) && "underline"}`}
                >
                  {branch.name}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownNavbar;
