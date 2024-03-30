import React, { useState } from "react";
import NavTabItem from "../../Elements/NavTabItem/NavTabItem";
import BelumBayar from "../../../pages/purchase/BelumBayar";
import PengambilanBarang from "../../../pages/purchase/PengambilanBarang";
import Selesai from "../../../pages/purchase/Selesai";
import Dibatalkan from "../../../pages/purchase/Dibatalkan";
import PengembalianBarang from "../../../pages/purchase/PengembalianBarang";

const NavTab = () => {
  const [activeItems, setActiveItems] = useState("Belum Bayar");

  return (
    <div>
      <div className="flex justify-center mt-6 overflow-x-auto">
        <NavTabItem isActive={activeItems === "Belum Bayar"} label="Belum Bayar" onClick={() => setActiveItems("Belum Bayar")} />
        <NavTabItem isActive={activeItems === "Pengambilan Barang"} label="Pengambilan Barang" onClick={() => setActiveItems("Pengambilan Barang")} />
        <NavTabItem isActive={activeItems === "Pengembalian Barang"} label="Pengembalian Barang" onClick={() => setActiveItems("Pengembalian Barang")} />
        <NavTabItem isActive={activeItems === "Selesai"} label="Selesai" onClick={() => setActiveItems("Selesai")} />
        <NavTabItem isActive={activeItems === "Dibatalkan"} label="Dibatalkan" onClick={() => setActiveItems("Dibatalkan")} />
      </div>
      <div className="my-5 mx-16">
        {activeItems === "Belum Bayar" ? <BelumBayar setActiveItems={setActiveItems} /> : null}
        {activeItems === "Pengambilan Barang" ? <PengambilanBarang /> : null}
        {activeItems === "Pengembalian Barang" ? <PengembalianBarang /> : null}
        {activeItems === "Selesai" ? <Selesai /> : null}
        {activeItems === "Dibatalkan" ? <Dibatalkan /> : null}
      </div>
    </div>
  );
};

export default NavTab;
