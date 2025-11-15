// src/layouts/HomeLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { Plus } from "lucide-react";
import { AddLpModal } from "../components/AddLpModal"; // ✅ 추가

export const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 모달 상태 추가
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col relative">
      <Navbar onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 pt-16 px-8">
        <Outlet />
      </main>

      {/* ✅ LP 추가 모달 */}
      {isModalOpen && <AddLpModal onClose={() => setIsModalOpen(false)} />}

      {/* ✅ 플로팅 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)} // 모달 열기
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-[55]"
      >
        <Plus size={28} />
      </button>

      <Footer />
    </div>
  );
};

export default HomeLayout;
