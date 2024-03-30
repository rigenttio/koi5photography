import React from "react";

const ItemNotFound = () => {
  return (
    <div className="h-[600px] bg-gray/60 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5">
        <div>
          <img src="/assets/img/hero-item-not-found.svg" alt="notfound" />
        </div>
        <p className="font-semibold">Belum ada pesanan</p>
      </div>
    </div>
  );
};

export default ItemNotFound;
