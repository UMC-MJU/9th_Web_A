// src/layouts/HomeLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { Plus } from "lucide-react";
import { AddLpModal } from "../components/AddLpModal";
import { useState } from "react";
import { useSidebar } from "../hooks/useSidebar";

export const HomeLayout = () => {
  const { isOpen, open, close, toggle } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col relative">
      {/* 햄버거 메뉴 → toggle() */}
      <Navbar onToggleSidebar={toggle} />

      {/* Sidebar 상태 관리: useSidebar 훅 */}
      <Sidebar isOpen={isOpen} onClose={close} />

      <main className="flex-1 pt-16 px-8">
        <Outlet />
      </main>

      {/* LP 추가 모달 */}
      {isModalOpen && <AddLpModal onClose={() => setIsModalOpen(false)} />}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg transition-transform hover:scale-105 z-[55]"
      >
        <Plus size={28} />
      </button>

      <Footer />
    </div>
  );
};

export default HomeLayout;
