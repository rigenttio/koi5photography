import React from "react";
import Navbar from "../components/Fragments/NavBar";
import Footer from "../components/Fragments/Footer";
import InputForm from "../components/Elements/Input";
import Button from "../components/Elements/Button/Button";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgotPasswordPage = () => {
  const { handleForgotPassword, setEmail, errorEmail } = useForgotPassword();
  return (
    <>
      <Navbar />

      <div className="grid grid-cols-2 my-[72px] container">
        <div>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-12 bg-gray py-12 px-8 rounded-xl">
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-4xl">Lupa kata sandi</h2>
                <p className="text-neutral-400">Masukan alamat email dan kamu akan mendapakan tautan untuk reset password</p>
              </div>
              <div className="flex flex-col gap-6">
                <InputForm onChange={(e) => setEmail(e.target.value)} image="/assets/icons/email-input.svg" type="email" placeholder="Email" name="email" />
                {errorEmail && <p className="-mt-4 font-normal text-xs text-red-500">{errorEmail}</p>}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit">Berikutnya</Button>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <img src="/assets/img/hero-forgot-password.svg" alt="" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPasswordPage;
