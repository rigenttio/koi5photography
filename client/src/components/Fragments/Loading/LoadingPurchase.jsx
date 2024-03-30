import React from "react";
import Spinner from "./Spinner";

const LoadingPurchase = () => {
  return (
    <div className="h-[450px] flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default LoadingPurchase;
