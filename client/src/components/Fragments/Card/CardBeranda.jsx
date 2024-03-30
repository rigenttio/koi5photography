import React from "react";

const CardBeranda = (props) => {
  const { theme = "dark", children, image, footer } = props;

  return theme === "light" ? (
    <div className="p-10 flex flex-col justify-center items-center gap-[14px] rounded-[40px] shadow-2xl bg-white w-full h-[330px]">
      <img src={image} alt="icon" />
      <h2 className="text-dark font-normal text-2xl">{children}</h2>
      <h1 className="text-dark font-extrabold text-4xl">{footer}</h1>
    </div>
  ) : (
    <div className="p-10 flex flex-col justify-center items-center gap-[14px] rounded-[40px] shadow-2xl bg-primary w-full h-[330px]">
      <img src={image} alt="icon" />
      <h2 className="text-white font-normal text-2xl">{children}</h2>
      <h1 className="text-white font-extrabold text-4xl">{footer}</h1>
    </div>
  );
};

export default CardBeranda;
