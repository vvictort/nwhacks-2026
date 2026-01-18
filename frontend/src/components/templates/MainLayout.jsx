import React from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neo-bg-100 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-4">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
