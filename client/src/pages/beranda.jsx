import ButtonLink from "../components/Elements/Button/ButtonLink";
import Navbar from "../components/Fragments/NavBar";
import HeroBerandaSvg from "../components/Elements/Svg/HeroBeranda";
import CardBeranda from "../components/Fragments/Card/CardBeranda";
import CardBranch from "../components/Fragments/Card/CardBranch";
import Footer from "../components/Fragments/Footer";

const BerandaPage = () => {
  return (
    <>
      <Navbar />

      <h1 className="font-extrabold text-4xl mt-[72px] mb-16 text-center">One Stop Service Rental Equipment</h1>
      <HeroBerandaSvg />
      <div className="py-[266px] bg-white mt-0">
        <div className="container flex flex-col lg:flex-row gap-8">
          <CardBeranda theme="light" image="/assets/icons/pengguna.svg" footer="5k+">
            Total Pengguna
          </CardBeranda>
          <CardBeranda image="/assets/icons/tersewa.svg" footer="2k+">
            Tersewa
          </CardBeranda>
          <CardBeranda theme="light" image="/assets/icons/pengunjung.svg" footer="188k+">
            Pengunjung
          </CardBeranda>
        </div>
      </div>
      <div className="container mt-[135px]">
        <h1 className="font-extrabold text-4xl text-center mb-16">Dapatkan layanan sewa kamera di lima tempat</h1>
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto branch">
          <CardBranch title="Koi5 Jogokaryan" colorHead="#00AED6" colorFoot="#0093B2">
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">Alamat</h2>
              <p className="font-normal text-base text-center">Jl. Jogokaryan 69A, Yogyakarta</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">No. Tlp</h2>
              <p className="font-normal text-base text-center">(0274) 378888</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">WhatsApp</h2>
              <p className="font-normal text-base text-center">082242775555</p>
            </div>
          </CardBranch>
          <CardBranch title="Koi5 Gejayan" colorHead="#EE2737" colorFoot="#AF272F">
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">Alamat</h2>
              <p className="font-normal text-base text-center">Jl. Selokan Mataram Gang Lada 01, Puren Yogyakarta</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">No. Tlp</h2>
              <p className="font-normal text-base text-center">(0274) 5012688</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">WhatsApp</h2>
              <p className="font-normal text-base text-center">082118555560</p>
            </div>
          </CardBranch>
          <CardBranch title="Koi5 Semarang" colorHead="#93328E" colorFoot="#80276C">
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">Alamat</h2>
              <p className="font-normal text-base text-center">Jl. Nangka Timur No 39, Semarang</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">No. Tlp</h2>
              <p className="font-normal text-base text-center">(024) 76585557</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">WhatsApp</h2>
              <p className="font-normal text-base text-center">08121555578</p>
            </div>
          </CardBranch>
          <CardBranch title="Koi5 Purworkerto" colorHead="#DF1995" colorFoot="#AA0061">
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">Alamat</h2>
              <p className="font-normal text-base text-center">Jl RA Wiraatmaja no 17 Purwokerto</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">No. Tlp</h2>
              <p className="font-normal text-base text-center">(0281) 7775566</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">WhatsApp</h2>
              <p className="font-normal text-base text-center">081339955560</p>
            </div>
          </CardBranch>
          <CardBranch title="Koi5 Ungaran" colorHead="#00AA13" colorFoot="#008C15">
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">Alamat</h2>
              <p className="font-normal text-base text-center">Jl. S Parman No.61 Ungaran Semarang</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">No. Tlp</h2>
              <p className="font-normal text-base text-center">(024) 76907555</p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1 mx-10">
              <h2 className="text-2xl font-extrabold text-center">WhatsApp</h2>
              <p className="font-normal text-base text-center">085195115557</p>
            </div>
          </CardBranch>
        </div>

        <div className="mt-[250px] flex flex-col lg:flex-row gap-16">
          <img src="/assets/img/hero-camera.svg" alt="hero" className="order-2 lg:order-1" />
          <div className="flex flex-col gap-[14px] justify-center order-1 lg:order-2">
            <h1 className="font-extrabold text-4xl text-center lg:text-start">Siap mengabadikan momen Anda?</h1>
            <span className="font-normal text-2xl text-center lg:text-start">Kami menyediakan peralatan yang anda butuhkan</span>
            <div className="flex justify-center lg:justify-start">
              <ButtonLink to="/register">Daftar Akun</ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BerandaPage;
