import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../apis/auth";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./common/ConfirmModalProps";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken } = useAuth();
  
  const withdrawMutation = useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      alert("회원 탈퇴 성공");

      // 클라이언트 상태 초기화
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAccessToken?.(null);
      setRefreshToken?.(null);

      navigate("/login", { replace: true });
    },
    onError: () => {
      alert("회원 탈퇴 실패");
    },
  });

  const handleWithdraw = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    withdrawMutation.mutate();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 오버레이 배경 - 클릭시 사이드바 닫힘 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed left-0 top-[64px] h-[calc(100%-64px)] w-64 bg-gray-900 text-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="사이드바 메뉴"
      >
        <div className="flex flex-col h-full p-6 justify-between">
          <nav className="flex flex-col gap-4">
            <NavLink 
              to="/search" 
              className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-200" 
              onClick={onClose}
            >
              🔍 찾기
            </NavLink>
            <NavLink 
              to="/my" 
              className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-200" 
              onClick={onClose}
            >
              👤 마이페이지
            </NavLink>
          </nav>

          {/* 탈퇴 버튼 */}
          <button
            onClick={handleWithdraw}
            className="mt-auto hover:bg-gray-700 text-white py-2 rounded transition-colors duration-200"
          >
            탈퇴하기
          </button>
        </div>
      </aside>

      {/* 탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        message="정말 탈퇴하시겠습니까?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}