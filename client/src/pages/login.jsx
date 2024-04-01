import React, { useState } from "react";
import Navbar from "../components/Fragments/NavBar";
import Footer from "../components/Fragments/Footer";
import InputForm from "../components/Elements/Input";
import Button from "../components/Elements/Button/Button";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/AuthContext";
import moment from "moment-timezone";

const LoginPage = () => {
  const { handleLogin, setEmail, setPassword, errorEmail, errorPassword, errorLimit, attemptLeft } = useLogin();

  const formatTime = (seconds) => {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    const remainingSeconds = Math.floor(duration.asSeconds() % 60);
    return `${minutes} menit ${remainingSeconds} detik`;
  };

  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 lg:grid-cols-2 my-[72px] container">
        <div className="order-2 lg:order-1 flex justify-center items-center">
          <img src="/assets/img/hero-login.svg" alt="hero" />
        </div>
        <div className="order-1 lg:order-2 px-3">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-12 bg-gray py-12 px-8 rounded-xl">
              <div className="flex flex-col gap-3">
                <h2 className="font-bold text-4xl">Login</h2>
                <p className="text-neutral-400">Masukan kredensial akun anda</p>
                {errorLimit && <p className="mt-4 font-normal text-center text-xs text-red-500">Silahkan tunggu dalam waktu {formatTime(errorLimit)} lagi</p>}
                {attemptLeft && <p className="mt-4 font-normal text-center text-xs text-red-500">Tersisa {attemptLeft} percobaan lagi</p>}
              </div>
              <div className="flex flex-col gap-6">
                <InputForm onChange={(e) => setEmail(e.target.value)} image="/assets/icons/email-input.svg" type="email" placeholder="Email" name="email" />
                {errorEmail && <p className="-mt-4 font-normal text-xs text-red-500">{errorEmail}</p>}
                <InputForm onChange={(e) => setPassword(e.target.value)} image="/assets/icons/password-input.svg" type="password" placeholder="Password" name="password" />
                {errorPassword && <p className="-mt-4 font-normal text-xs text-red-500">{errorPassword}</p>}
              </div>
              <Link to="/forgot-password" className="font-semibold text-primary">
                Lupa kata sandi?
              </Link>
              <div className="flex flex-col gap-3">
                <Button type="submit">Masuk</Button>
                <p className="font-normal text-base text-center">
                  Belum mempunyai akun?{" "}
                  <Link to="/register" className="text-primary font-semibold">
                    Daftar
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

export default LoginPage;
