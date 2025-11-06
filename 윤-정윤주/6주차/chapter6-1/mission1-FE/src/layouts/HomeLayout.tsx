import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Plus } from "lucide-react";

const HomeLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-[#0B0E13] text-white">
      {/* 상단 고정 네브바 (사이드바 제어도 내부에서 수행) */}
      <Navbar />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 pt-16 p-6 overflow-auto">
        <Outlet />
      </main>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
      >
        <Plus size={28} />
      </button>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
