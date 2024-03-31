import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../../hooks/useLogout";
import { useAuth } from "../../../context/AuthContext";
import { env } from "../../../lib/env";

const HeaderAuth = () => {
  const { handleLogout } = useLogout();
  const { isLoggedIn, authUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {authUser && (
        <div className="flex items-center gap-2 cursor-pointer max-w-52">
          <p className="text-base truncate">
            {authUser.first_name} {authUser.last_name}
          </p>
          <div className="min-w-9 min-h-9">
            <img src={authUser.avatar ? `${env("VITE_IMAGE_BASE_URL")}/avatars/${authUser.avatar}` : "/default-avatar.png"} alt="profile" className="w-9 h-9 object-cover object-center rounded-full" />
          </div>
        </div>
      )}

      <div className="lg:absolute">
        {/* Place event handlers on the parent element */}
        <div className={`${isDropdownOpen ? "block" : "hidden"} bg-gray rounded-lg lg:rounded-3xl py-2 md:py-6 top-10 -right-[30%]`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to={`/purchase`} className={`md:py-[10px] py-2 px-4 md:px-6 inline-block w-full whitespace-nowrap hover:underline`}>
            Pesanan Saya
          </Link>
          <Link to={`/profile`} className={`md:py-[10px] py-2 px-4 md:px-6 inline-block w-full whitespace-nowrap hover:underline`}>
            Akun Saya
          </Link>
          <Link to={`/bookmark`} className={`md:py-[10px] py-2 px-4 md:px-6 inline-block w-full whitespace-nowrap hover:underline`}>
            Bookmark
          </Link>
          <span onClick={handleLogout} className="md:py-[10px] py-2 px-4 md:px-6 inline-block w-full whitespace-nowrap hover:underline cursor-pointer">
            Log out
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderAuth;
