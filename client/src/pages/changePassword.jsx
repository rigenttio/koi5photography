import React from "react";
import InputForm from "../components/Elements/Input";
import Button from "../components/Elements/Button/Button";
import SidebarAuthLayout from "../components/Layouts/SidebarAuthLayout";
import { Link } from "react-router-dom";
import { useChangePassword } from "../hooks/useChangePassword";

const ChangePasswordPage = () => {
  const { handleChangePassword, oldPassword, password, errorOldPassword, errorPassword, failedOldPassword, setOldPassword, setPassword } = useChangePassword();
  return (
    <SidebarAuthLayout>
      <div className="m-16">
        <div className="mb-8">
          <Link to="/profile" className="underline text-primary">
            Kembali
          </Link>
        </div>
        <p className="font-semibold mb-1">Ubah Kata Sandi</p>
        <p className="text-xs mb-6">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
        <form onSubmit={handleChangePassword}>
          <div className="flex gap-6">
            <div className="flex flex-col w-full gap-6">
              <InputForm value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} image="/assets/icons/password-input.svg" type="password" placeholder="Password Lama" />
              {errorOldPassword && <p className="-mt-4 font-normal text-xs text-red-500">{errorOldPassword}</p>}
              {failedOldPassword && <p className="-mt-4 font-normal text-xs text-red-500">{failedOldPassword}</p>}
              <InputForm value={password} onChange={(e) => setPassword(e.target.value)} image="/assets/icons/password-input.svg" type="password" placeholder="Password Baru" />
              {errorPassword && <p className="-mt-4 font-normal text-xs text-red-500">{errorPassword}</p>}
            </div>

            <div className="w-full flex flex-col items-center justify-center">
              <img src="/assets/img/hero-change-password.svg" alt="" />
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-6">
            <div>
              <Button type="submit">Ubah Password</Button>
            </div>
          </div>
        </form>
      </div>
    </SidebarAuthLayout>
  );
};

export default ChangePasswordPage;
