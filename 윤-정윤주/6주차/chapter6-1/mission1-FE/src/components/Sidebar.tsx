import { useEffect } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // 화면 크기 변경 시 사이드바 자동 닫기
  useEffect(() => {
    const handleResize = () => {
      // 768px 이하로 줄어들면 자동으로 닫기
      if (window.innerWidth <= 768 && isOpen) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  return (
    <>
      {/* 반투명 배경 (사이드바 열렸을 때만 표시) */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? "visible bg-black/50" : "invisible bg-transparent"
        }`}
        onClick={onClose}
      />

      {/* 왼쪽 슬라이드 메뉴 (항상 네브바 아래, 네브바 덮지 않음) */}
      <aside
        className={`fixed left-0 top-[64px] h-[calc(100%-64px)] w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full p-6">
          {/* 메뉴 목록 */}
          <nav className="flex flex-col gap-4">
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-800 transition ${
                  isActive ? "bg-gray-800" : ""
                }`
              }
              onClick={onClose}
            >
              🔍 찾기
            </NavLink>
            <NavLink
              to="/my"
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-800 transition ${
                  isActive ? "bg-gray-800" : ""
                }`
              }
              onClick={onClose}
            >
              👤 마이페이지
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
}
