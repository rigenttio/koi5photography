import React from "react";

const ProductNotFound = () => {
  return (
    <div className="h-[600px] col-span-full bg-gray/60 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5">
        <div>
          <img src="/assets/img/hero-product-not-found.svg" alt="notfound" />
        </div>
        <p className="font-semibold">Produk tidak ada</p>
      </div>
    </div>
  );
};

export default ProductNotFound;
