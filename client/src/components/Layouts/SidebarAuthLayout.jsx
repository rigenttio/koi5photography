import React from "react";
import SidebarAuth from "../Fragments/Sidebar/SidebarAuth";
import Navbar from "../Fragments/NavBar";

const SidebarAuthLayout = (props) => {
  const { children } = props;

  return (
    <>
      <Navbar />
      <div className="flex">
        <SidebarAuth />
        <main className="flex-1 h-[84vh] overflow-y-auto bg-gray/20">{children}</main>
      </div>
    </>
  );
};

export default SidebarAuthLayout;
