import React from "react";

const NavTabItem = (props) => {
  const { label, isActive, onClick } = props;
  return (
    <>
      {isActive ? (
        <button onClick={onClick} className="text-sm px-8 transition-all hover:bg-primary/15 font-semibold py-2 text-primary">
          {label}
          <div className="w-9 mx-auto  h-0.5 bg-primary"></div>
        </button>
      ) : (
        <button onClick={onClick} className="text-sm px-8 transition-all hover:text-primary  hover:bg-primary/15 font-semibold text-[#AAAAAA] py-2">
          {label}
          <div className="w-9 mx-auto h-0.5 bg-transparent"></div>
        </button>
      )}
    </>
  );
};

export default NavTabItem;
