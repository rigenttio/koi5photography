import React from "react";
import SidebarBranch from "../Fragments/Sidebar/SidebarBranch";
import Navbar from "../Fragments/NavBar";

const SidebarBranchLayout = (props) => {
  const { children } = props;
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <SidebarBranch />
        <main className="flex-1 h-[84vh] overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default SidebarBranchLayout;
