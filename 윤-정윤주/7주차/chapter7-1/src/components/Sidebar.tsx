import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ConfirmModal from "./common/ConfirmModalProps";
import { deleteUser } from "../apis/auth";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken } = useAuth(); // context에서 가져오기
  
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
      {/* 기존 사이드바 */}
      <aside
        className={`fixed left-0 top-[64px] h-[calc(100%-64px)] w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full p-6 justify-between">
          <nav className="flex flex-col gap-4">
            <NavLink to="/search" className="block px-3 py-2 rounded hover:bg-gray-800 transition" onClick={onClose}>
              🔍 찾기
            </NavLink>
            <NavLink to="/my" className="block px-3 py-2 rounded hover:bg-gray-800 transition" onClick={onClose}>
              👤 마이페이지
            </NavLink>
          </nav>

          {/* 탈퇴 버튼 */}
          <button
            onClick={handleWithdraw}
            className="mt-auto hover:bg-gray-700 text-white py-2 rounded transition"
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
