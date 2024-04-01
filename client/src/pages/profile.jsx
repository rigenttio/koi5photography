import React, { useEffect, useState } from "react";
import SidebarAuthLayout from "../components/Layouts/SidebarAuthLayout";
import InputForm from "../components/Elements/Input";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "../context/AuthContext";
import { env } from "../lib/env";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import Button from "../components/Elements/Button/Button";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [previewPic, setPreviewPic] = useState(null);
  const { authUser } = useAuth();

  const [firstName, setFirstName] = useState(authUser.first_name);
  const [lastName, setLastName] = useState(authUser.last_name);
  const [noTlp, setNoTlp] = useState(authUser.no_tlp);
  const [address, setAddress] = useState(authUser.address);
  const [avatar, setAvatar] = useState(null);

  const { handleUpdateProfile, errorFirstName, errorLastName, errorNoTlp, errorAddress, errorAvatar } = useUpdateProfile(firstName, lastName, noTlp, address, avatar);

  return (
    <SidebarAuthLayout>
      <div className="m-16">
        <p className="font-semibold mb-1">Profil saya</p>
        <p className="text-xs mb-6">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
        <form onSubmit={handleUpdateProfile} encType="multipart/form-data">
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            <div className="flex flex-col w-full gap-6">
              <div className="flex gap-6">
                <div className="flex flex-col w-full gap-6">
                  <InputForm value={firstName} onChange={(e) => setFirstName(e.target.value)} image="/assets/icons/user-input.svg" type="text" placeholder="Nama Depan" name="first_name" />
                  {errorFirstName && <p className="-mt-4 font-normal text-xs text-red-500">{errorFirstName}</p>}
                </div>
                <div className="flex flex-col w-full gap-6">
                  <InputForm value={lastName} onChange={(e) => setLastName(e.target.value)} image="/assets/icons/user-input.svg" type="text" placeholder="Nama Belakang" name="last_name" />
                  {errorLastName && <p className="-mt-4 font-normal text-xs text-red-500">{errorLastName}</p>}
                </div>
              </div>
              <InputForm readOnly={true} value={authUser.email} image="/assets/icons/email-input.svg" type="email" placeholder="Email" name="email" />
              <InputForm value={noTlp} onChange={(e) => setNoTlp(e.target.value)} image="/assets/icons/tlp-input.svg" type="tel" placeholder="No. Telephone" name="no_tlp" />
              {errorNoTlp && <p className="-mt-4 font-normal text-xs text-red-500">{errorNoTlp}</p>}
              <InputForm value={address} onChange={(e) => setAddress(e.target.value)} image="/assets/icons/address-input.svg" type="text" placeholder="Alamat Lengkap" name="address" />
              {errorAddress && <p className="-mt-4 font-normal text-xs text-red-500">{errorAddress}</p>}
            </div>

            <div className="w-full flex flex-col items-center justify-center">
              {errorAvatar && <p className="-mt-4 font-normal text-xs text-red-500">{errorAvatar}</p>}
              <div>
                <img src={previewPic ? previewPic : authUser.avatar ? `${env("VITE_IMAGE_BASE_URL")}/avatars/${authUser.avatar}` : "/default-avatar.png"} alt="" className="h-[100px] w-[100px] rounded-full  object-cover bg-center mb-5" />
              </div>
              <input
                className="hidden"
                accept=".png, .jpg, .jpeg"
                type="file"
                id="select-image"
                onChange={(e) => {
                  if (previewPic) {
                    URL.revokeObjectURL(previewPic);
                  }
                  let avatarFile = e.target.files[0];
                  setAvatar(avatarFile);
                  setPreviewPic(URL.createObjectURL(avatarFile));
                }}
              />
              <label className="px-[17.5px] py-[5px] rounded-[10px] border text-primary  cursor-pointer" htmlFor="select-image">
                Pilih Avatar
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-3">
            <Link to="/profile/change-password" className="text-primary font-semibold underline">
              Ubah kata sandi
            </Link>
            <div>
              <Button type="submit">Perbarui</Button>
            </div>
          </div>
        </form>
      </div>
    </SidebarAuthLayout>
  );
};

export default ProfilePage;
