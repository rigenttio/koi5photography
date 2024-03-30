import React, { useEffect, useState } from "react";
import Navbar from "../components/Fragments/NavBar";
import ButtonLink from "../components/Elements/Button/ButtonLink";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import LoadingPulse from "../components/Fragments/Loading/LoadingPulse";

const VerificationEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email"));
  const [token, setToken] = useState(searchParams.get("token"));
  const [succesVerif, setSuccesVerif] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifEmail = async (email, token) => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.patch("/verify-email", {
          email: email,
          token: token,
        });
        setSuccesVerif(true);
        localStorage.removeItem("verification");
        setIsLoading(false);
      } catch (error) {
        setSuccesVerif(false);
        setIsLoading(false);
      }
    };

    if (token && email) {
      return () => verifEmail(email, token);
    } else {
      navigate("/");
    }
  }, []);

  return isLoading ? (
    <LoadingPulse />
  ) : (
    <>
      <Navbar />

      <div className="mt-[72px] container flex flex-col justify-center gap-6">
        <div className="flex justify-center">
          <img src={`/assets/img/${succesVerif ? "hero-verif-success.svg" : "hero-verif-failed.svg"}`} alt="verif" />
        </div>
        <h2 className="text-center text-3xl font-bold"> {succesVerif ? "Verifikasi Email Berhasil" : "Gagal verifikasi email"}</h2>
        {succesVerif && (
          <div className="flex justify-center">
            <ButtonLink to="/login">Silahkan Masuk</ButtonLink>
          </div>
        )}
      </div>
    </>
  );
};

export default VerificationEmailPage;
