import React from "react";
import { Link } from "react-router-dom";

const ButtonLink = (props) => {
  const { children, to, color = "dark" } = props;
  return color === "light" ? (
    <Link to={to} className="inline-block text-center py-2 px-6 border border-primary text-primary text-lg font-medium bg-white hover:scale-105 duration-300 rounded-[96px]">
      {children}
    </Link>
  ) : (
    <Link to={to} className="inline-block text-center py-2 px-6 text-white text-lg font-medium bg-primary hover:bg-[#c70e1d] hover:scale-105 duration-300 rounded-[96px]">
      {children}
    </Link>
  );
};

export default ButtonLink;
