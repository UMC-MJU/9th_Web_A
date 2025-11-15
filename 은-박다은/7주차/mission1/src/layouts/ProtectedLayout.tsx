import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Plus } from "lucide-react";
import { useState } from "react";
import LPWriteModal from "../components/LPWriteModal";

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, showAuthAlert: true }}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* 상단 네브바 */}
      <Navbar />

      <div className="flex flex-1 pt-16">
        {/* 사이드바 */}
        <Sidebar isOpen={true} onClose={() => {}} />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 ml-60 p-6 ">
          <Outlet />
        </main>
      </div>

      {/* 플로팅 버튼 */}
      <LPWriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        <Plus size={28} />
      </button>

      <Footer />
    </div>
  );
};

export default ProtectedLayout;
