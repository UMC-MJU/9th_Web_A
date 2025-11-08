// src/layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { Plus } from "lucide-react";

export const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* 상단 네비게이션 (항상 맨 위) */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* 사이드바 (Navbar 아래에서 시작, Footer 포함해서 덮어도 됨) */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* 메인 영역 */}
      <main className="flex-1 pt-16 px-8">
        <Outlet />
      </main>

      {/* 플로팅 + 버튼 */}
      <button
        onClick={() => navigate("/create")}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-[55]"
      >
        <Plus size={28} />
      </button>

      {/* 하단 Footer — 왼쪽 여백 없이 전체 폭 */}
      <Footer />
    </div>
  );
};

export default HomeLayout;
