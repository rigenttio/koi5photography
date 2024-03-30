import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { env } from "../../../lib/env";

const SidebarAuth = () => {
  const { authUser } = useAuth();
  return (
    <aside className="w-72 overflow-y-auto pr-6 py-16 pl-8 h-[84vh] ">
      <div className="flex gap-3 items-center">
        <div className="min-w-12 min-h-12">
          <img src={authUser.avatar ? `${env("VITE_IMAGE_BASE_URL")}/avatars/${authUser.avatar}` : "/default-avatar.png"} alt="profil" className="w-12 h-12 object-cover object-center rounded-full" />
        </div>
        <span className="font-semibold text-sm truncate">
          {authUser.first_name} {authUser.last_name}
        </span>
      </div>
      <div className="flex flex-col gap-5 mt-12">
        <div className="flex gap-2 items-center">
          <img src="/assets/icons/user-link.svg" alt="icon" />
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "text-sm font-bold text-primary" : "text-sm font-semibold text-white hover:text-primary")}>
            Akun Saya
          </NavLink>
        </div>
        <div className="flex gap-2 items-center">
          <img src="/assets/icons/purchase-link.svg" alt="icon" />
          <NavLink to="/purchase" className={({ isActive }) => (isActive ? "text-sm font-bold text-primary" : "text-sm font-semibold text-white hover:text-primary")}>
            Pesanan Saya
          </NavLink>
        </div>
        <div className="flex gap-2 items-center">
          <img src="/assets/icons/bookmark-link.svg" alt="icon" />
          <NavLink to="/bookmark" className={({ isActive }) => (isActive ? "text-sm font-bold text-primary" : "text-sm font-semibold text-white hover:text-primary")}>
            Bookmark
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAuth;
