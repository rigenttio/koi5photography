import React from "react";
import Navbar from "../components/Fragments/NavBar";
import Button from "../components/Elements/Button/Button";
import InputForm from "../components/Elements/Input";
import Footer from "../components/Fragments/Footer";
import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

const RegisterPage = () => {
  const { handleRegister, setFirtsName, setLastName, setEmail, setNoTlp, setAddress, setPassword, setPasswordConfirm, errorFirtsName, errorLastName, errorEmail, errorNoTlp, errorAddress, errorPassword, errorPasswordConfirm } =
    useRegister();

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 my-[72px] container">
        <div className="order-2 lg:order-1 flex justify-center items-center">
          <img src="/assets/img/hero-register.svg" alt="hero" />
        </div>
        <div className="order-1 lg:order-2 px-3">
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-12 bg-gray py-12 px-8 rounded-xl">
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-4xl">Sign Up</h2>
                <p className="text-neutral-400">Masukkan Informasi Akun Anda</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="flex flex-col gap-6">
                    <InputForm onChange={(e) => setFirtsName(e.target.value)} image="/assets/icons/user-input.svg" type="text" placeholder="Nama Depan" name="first_name" />
                    {errorFirtsName && <p className="-mt-4 font-normal text-xs text-red-500">{errorFirtsName}</p>}
                  </div>
                  <div className="flex flex-col gap-6">
                    <InputForm onChange={(e) => setLastName(e.target.value)} image="/assets/icons/user-input.svg" type="text" placeholder="Nama Belakang" name="last_name" />
                    {errorLastName && <p className="-mt-4 font-normal text-xs text-red-500">{errorLastName}</p>}
                  </div>
                </div>
                <InputForm onChange={(e) => setEmail(e.target.value)} image="/assets/icons/email-input.svg" type="email" placeholder="Email" name="email" />
                {errorEmail && <p className="-mt-4 font-normal text-xs text-red-500">{errorEmail}</p>}
                <InputForm onChange={(e) => setNoTlp(e.target.value)} image="/assets/icons/tlp-input.svg" type="tel" placeholder="No. Telephone" name="no_tlp" />
                {errorNoTlp && <p className="-mt-4 font-normal text-xs text-red-500">{errorNoTlp}</p>}
                <InputForm onChange={(e) => setAddress(e.target.value)} image="/assets/icons/address-input.svg" type="text" placeholder="Alamat Lengkap" name="address" />
                {errorAddress && <p className="-mt-4 font-normal text-xs text-red-500">{errorAddress}</p>}
                <InputForm onChange={(e) => setPassword(e.target.value)} image="/assets/icons/password-input.svg" type="password" placeholder="Password" name="password" />
                {errorPassword && <p className="-mt-4 font-normal text-xs text-red-500">{errorPassword}</p>}
                <InputForm onChange={(e) => setPasswordConfirm(e.target.value)} image="/assets/icons/password-input.svg" type="password" placeholder="Konfirmasi Password" name="password_confirmation" />
                {errorPasswordConfirm && <p className="-mt-4 font-normal text-xs text-red-500">{errorPasswordConfirm}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit">Daftar</Button>
                <p className="font-normal text-base text-center">
                  Sudah mempunyai akun?{" "}
                  <Link to="/login" className="text-primary font-semibold">
                    Masuk
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterPage;
