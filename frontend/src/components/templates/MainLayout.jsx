import React from "react";
import Navbar from "../organisms/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neo-bg-100 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 px-4 pb-16">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </main>

      <footer className="py-8 text-center text-neo-bg-500 text-sm">
        <p>© 2026 ToyShare. Spreading Joy Worldwide.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
