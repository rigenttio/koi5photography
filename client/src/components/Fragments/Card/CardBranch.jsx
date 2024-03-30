import React from "react";

const CardBranch = (props) => {
  const { children, colorHead, colorFoot, title } = props;

  return (
    <div className={`pb-10 rounded-[40px] flex flex-col gap-[18px] justify-center items-center  w-full h-full`} style={{ backgroundColor: colorFoot }}>
      <div className={`px-6 pb-16 pt-10  rounded-[40px] w-full flex flex-col items-center justify-center gap-6`} style={{ backgroundColor: colorHead }}>
        <img src="/assets/logo/logo-koi5-white.svg" alt="logo" className="w-[75px] h-[85px]" />
        <h1 className="font-extrabold text-2xl text-center">{title}</h1>
      </div>

      {children}
    </div>
  );
};

export default CardBranch;
