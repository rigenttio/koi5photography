import React from "react";

const Button = (props) => {
  const { children, onClick = () => {}, type = "button", color = "dark", disabled } = props;
  return color === "light" ? (
    <button disabled={disabled} type={type} onClick={onClick} className="py-2 disabled:bg-white/20 px-6 text-primary border border-primary text-lg font-medium bg-white hover:scale-105 duration-300 rounded-[96px]">
      {children}
    </button>
  ) : (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`py-2 px-6 text-white text-lg font-medium bg-primary  duration-300 rounded-[96px] 
    disabled:opacity-20 disabled:cursor-not-allowed
    ${disabled ? "" : "hover:scale-105 hover:bg-[#c70e1d]"}`}
    >
      {children}
    </button>
  );
};

export default Button;
