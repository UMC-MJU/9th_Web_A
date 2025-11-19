import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus } from "lucide-react";
import { useState } from "react";
import LPWriteModal from "../components/LPWriteModal";

const HomeLayout = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar />

      <main
        className={`flex-1 pt-16 p-6 overflow-auto ${
          isAuthPage ? "flex items-center justify-center" : ""
        }`}
      >
        <Outlet />
      </main>

      <LPWriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {!isAuthPage && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={28} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default HomeLayout;
