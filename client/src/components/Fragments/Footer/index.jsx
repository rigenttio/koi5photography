import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray mt-28">
      <div className="container">
        <div className="grid lg:grid-cols-4 grid-flow-row gap-4 lg:gap-0 pt-16 pb-8  min-h-[358px]">
          <div className="flex flex-col justify-between h-full col-span-1">
            <div className="mb-4 lg:mb-0">
              <img src="/assets/logo/logo-koi5-white.svg" alt="logo" className="mb-2 w-[68px] h-[76px]" />
              <p className="text-base text-white font-normal">One stop service rental equipment</p>
            </div>
            <div>
              <div className="flex items-center justify-start gap-2 mb-[6px]">
                <img src="/assets/icons/email.svg" alt="" />
                <p className="text-base text-white font-normal">koi5photographyjogja@gmail.com</p>
              </div>
              <div className="flex items-center justify-start gap-2">
                <img src="/assets/icons/instagram.svg" alt="" />
                <p className="text-base text-white font-normal">koi5photojogja</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col col-span-2 justify-between text-center px-10">
            <div className="mb-4 lg:mb-0">
              <h2 className="font-bold text-xl text-white mb-3">Tautan</h2>
              <div className="flex flex-col gap-1 font-normal text-white text-base text-center justify-center items-center">
                <Link to="/" className="w-fit hover:opacity-100 opacity-80">
                  Beranda
                </Link>
                <Link to="/about" className="w-fit hover:opacity-100 opacity-80">
                  Tentang
                </Link>
                <Link to="/contact" className="w-fit hover:opacity-100 opacity-80">
                  Hubungi Kami
                </Link>
              </div>
            </div>
            <hr className="w-full h-[1px] bg-white mb-[54px]" />
          </div>
          <div className="flex flex-col col-span-1 justify-end text-right">
            <p className="text-base text-white font-normal">
              © <span className="font-bold text-white">Koi5Photography</span> 2024. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
