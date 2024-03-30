import React, { useState } from "react";
import ButtonLink from "../../Elements/Button/ButtonLink";
import { Link, NavLink } from "react-router-dom";
import DropdownNavbar from "../Dropdown/DropdownNavbar";
import HeaderAuth from "../Dropdown/HeaderAuth";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../Elements/Button/Button";
import { useLogout } from "../../../hooks/useLogout";

const Navbar = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { isLoggedIn } = useAuth();
  const { handleLogout } = useLogout();

  const toggleMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  return (
    <nav className="bg-dark top-0 sticky z-50">
      <div className="container flex py-8 items-center justify-between">
        <div>
          <Link to={"/"}>
            <img src="/assets/logo/logo-koi5.svg" alt="logo" />
          </Link>
        </div>
        {/* desktop */}
        <div className="lg:flex items-center hidden gap-10">
          <div>
            <NavLink to={"/"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
              Beranda
            </NavLink>
          </div>
          <div>
            <NavLink to={"/about"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
              Tentang
            </NavLink>
          </div>
          <div>
            <NavLink to={"/contact"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
              Hubungi Kami
            </NavLink>
          </div>

          <DropdownNavbar>Cabang</DropdownNavbar>

          {isLoggedIn ? (
            <HeaderAuth />
          ) : (
            <div className="flex gap-2">
              <ButtonLink to="/login">Masuk</ButtonLink>
              <ButtonLink to="/register" color="light">
                Daftar
              </ButtonLink>
            </div>
          )}
        </div>

        {/* toggle humburger */}
        <div onClick={toggleMenu} className="lg:hidden cursor-pointer">
          {isOpenMenu ? <i className="fa-solid text-xl md:text-2xl fa-xmark"></i> : <i className="fa-solid text-xl md:text-2xl fa-bars-staggered"></i>}
        </div>

        {/* mobile */}
        {isOpenMenu && (
          <div className="bg-dark lg:hidden absolute overflow-y-auto flex flex-col gap-6 right-0 left-0 h-screen top-24 w-full py-8 px-10">
            <div>
              <NavLink to={"/"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
                Beranda
              </NavLink>
            </div>
            <div>
              <NavLink to={"/about"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
                Tentang
              </NavLink>
            </div>
            <div>
              <NavLink to={"/contact"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
                Hubungi Kami
              </NavLink>
            </div>
            {isLoggedIn && (
              <>
                <div>
                  <NavLink to={"/purchase"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
                    Pesanan Saya
                  </NavLink>
                </div>
                <div>
                  <NavLink to={"/profile"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
                    Akun Saya
                  </NavLink>
                </div>
                <div>
                  <NavLink to={"/bookmark"} className={({ isActive }) => (isActive ? "font-bold text-lg underline" : "font-bold text-lg hover:underline")}>
                    Bookmark
                  </NavLink>
                </div>
              </>
            )}

            <DropdownNavbar>Cabang</DropdownNavbar>

            {isLoggedIn ? (
              <Button onClick={handleLogout}>Log out</Button>
            ) : (
              <div className="flex justify-center gap-2">
                <ButtonLink to="/login">Masuk</ButtonLink>
                <ButtonLink to="/register" color="light">
                  Daftar
                </ButtonLink>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
