import { useEffect, useState } from "react";
import Navbar from "../components/Fragments/NavBar";
import { useNavigate } from "react-router-dom";

const VerificationPage = () => {
  const navigate = useNavigate();
  const verif = localStorage.getItem("verification");
  const [parseData, setParseData] = useState(null);

  useEffect(() => {
    if (verif) {
      const parsedVerif = JSON.parse(verif);
      if (parsedVerif.type && parsedVerif.email) {
        setParseData(parsedVerif);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [verif, navigate]);

  return (
    <>
      <Navbar />

      <div className="mt-[72px] container flex flex-col justify-center gap-6">
        <div className="flex justify-center">
          <img src="/assets/img/hero-verif.svg" alt="verif" />
        </div>
        {parseData && (
          <>
            <h2 className="text-center text-3xl font-bold">{parseData.type === "verif-email" ? "Email verifikasi telah dikirim" : "Email Reset Password telah dikirim"}</h2>

            <p className="text-center font-medium text-base max-w-[675px] mx-auto">
              Silakan periksa kotak masuk email <span className="text-primary">{parseData.email}</span> dan ikuti petunjuk untuk menyelesaikan proses {parseData.type === "verif-email" ? "verifikasi." : "reset password."} Jika Anda tidak
              melihat email dari kami, periksa folder spam.
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default VerificationPage;
