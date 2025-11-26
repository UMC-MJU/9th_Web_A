import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus } from "lucide-react";
import { useState } from "react";
import ModalCreateLP from "../components/ModalCreateLP";

const HomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#0B0E13] text-white">
      {/* 상단 고정 네브바 (사이드바 제어도 내부에서 수행) */}
      <Navbar />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 pt-16 p-6 overflow-auto">
        <Outlet />
      </main>

      {/* 플로팅 + 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-50"
      >
        <Plus size={28} />
      </button>

      {/* 모달 */}
      {<ModalCreateLP open={isModalOpen} onClose={() => setIsModalOpen(false)} />}

      
      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
