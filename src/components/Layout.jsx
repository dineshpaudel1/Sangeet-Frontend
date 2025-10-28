import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className={`flex-1 min-h-screen bg-black text-white pt-[5rem] px-2 overflow-y-auto transition-all duration-300 ${
          collapsed ? 'ml-[4rem]' : 'ml-[15rem]'
          }`}
        >

          <Outlet context={{ collapsed }} />
        </main>
      </div>
      <Footer collapsed={collapsed} />
    </div>
  );
};

export default Layout;
