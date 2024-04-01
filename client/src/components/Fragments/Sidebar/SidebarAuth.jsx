import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { env } from "../../../lib/env";

const SidebarAuth = () => {
  const { authUser } = useAuth();
  return (
    <aside className="lg:w-72 overflow-y-auto pr-6 py-16 pl-8 h-[84vh] hidden md:block md:w-fit">
      <div className="flex gap-3 items-center">
        <div className="min-w-12 min-h-12">
          <img src={authUser.avatar ? `${env("VITE_IMAGE_BASE_URL")}/avatars/${authUser.avatar}` : "/default-avatar.png"} alt="profil" className="w-12 h-12 object-cover object-center rounded-full" />
        </div>
        <span className="font-semibold text-sm truncate hidden lg:inline-block">
          {authUser.first_name} {authUser.last_name}
        </span>
      </div>
      <div className="flex flex-col gap-5 mt-12 ">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "text-sm font-bold text-primary mix-blend-normal flex gap-2 items-center" : "text-sm font-semibold text-white mix-blend-luminosity hover:mix-blend-normal hover:text-primary flex gap-2 items-center"
          }
        >
          <img src="/assets/icons/user-link.svg" className="mx-auto lg:mx-0" alt="icon" />
          <p className="hidden lg:inline-block">Akun Saya</p>
        </NavLink>

        <NavLink
          to="/purchase"
          className={({ isActive }) =>
            isActive ? "text-sm font-bold text-primary mix-blend-normal flex gap-2 items-center" : "text-sm font-semibold text-white mix-blend-luminosity hover:mix-blend-normal hover:text-primary flex gap-2 items-center"
          }
        >
          <img src="/assets/icons/purchase-link.svg" className="mx-auto lg:mx-0" alt="icon" />
          <p className="hidden lg:inline-block">Pesanan Saya</p>
        </NavLink>

        <NavLink
          to="/bookmark"
          className={({ isActive }) =>
            isActive ? "text-sm font-bold text-primary mix-blend-normal flex gap-2 items-center" : "text-sm font-semibold text-white mix-blend-luminosity hover:mix-blend-normal hover:text-primary flex gap-2 items-center"
          }
        >
          <img src="/assets/icons/bookmark-link.svg" className="mx-auto lg:mx-0" alt="icon" />
          <p className="hidden lg:inline-block">Bookmark</p>
        </NavLink>
      </div>
    </aside>
  );
};

export default SidebarAuth;
