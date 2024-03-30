import React, { useEffect, useState } from "react";
import Navbar from "../components/Fragments/NavBar";
import Button from "../components/Elements/Button/Button";
import InputForm from "../components/Elements/Input";
import { useResetPassword } from "../hooks/useResetPassword";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email"));
  const [token, setToken] = useState(searchParams.get("token"));

  useEffect(() => {
    if (!token && !email) {
      return navigate("/");
    }
  }, []);

  const { handleResetPassword, setPassword, setPasswordConfirm, errorPassword, errorPasswordConfirm } = useResetPassword(email, token);
  return (
    <>
      <Navbar />

      <div className="grid grid-cols-2 my-[72px] container">
        <div>
          <form onSubmit={handleResetPassword}>
            <div className="flex flex-col gap-12 bg-gray py-12 px-8 rounded-xl">
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-4xl">Reset Password</h2>
                <p className="text-neutral-400">Masukan password baru</p>
              </div>
              <div className="flex flex-col gap-6">
                <InputForm onChange={(e) => setPassword(e.target.value)} image="/assets/icons/password-input.svg" type="password" placeholder="Password Baru" name="password" />
                {errorPassword && <p className="-mt-4 font-normal text-xs text-red-500">{errorPassword}</p>}
                <InputForm onChange={(e) => setPasswordConfirm(e.target.value)} image="/assets/icons/password-input.svg" type="password" placeholder="Konfirmasi Password Baru" name="password_confirmation" />
                {errorPasswordConfirm && <p className="-mt-4 font-normal text-xs text-red-500">{errorPasswordConfirm}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit">Ubah Password</Button>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <img src="/assets/img/hero-reset-password.svg" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
