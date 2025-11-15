import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth(); // accessToken 가져오기
  const [showModal, setShowModal] = useState(false);

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete("/v1/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      alert("회원 탈퇴가 완료되었습니다.");
      logout();
      navigate("/login");
    },
    onError: (error: any) => {
      console.error(error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    },
  });

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    deleteUserMutation.mutate();
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black/40 z-[45]"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-[64px] left-0 h-[calc(100vh-64px)] w-56 bg-[#141414] text-white flex flex-col shadow-md z-[50]
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex flex-col gap-6 mt-10 pl-6">
          <NavLink
            to="/search"
            className="flex items-center gap-3 text-gray-300 hover:text-[#f72585] transition-colors"
          >
            <FiSearch size={18} />
            <span className="text-sm font-medium">찾기</span>
          </NavLink>

          <NavLink
            to="/my"
            className="flex items-center gap-3 text-gray-300 hover:text-[#f72585] transition-colors"
          >
            <FaUser size={18} />
            <span className="text-sm font-medium">마이페이지</span>
          </NavLink>
        </nav>

        <div className="mt-auto mb-6 text-center">
          <p
            onClick={handleDeleteClick}
            className="text-white text-xs cursor-pointer hover:text-[#f72585] transition-colors"
          >
            탈퇴하기
          </p>
        </div>
      </aside>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex justify-center items-center">
          <div className="bg-[#1e1e1e] text-white rounded-2xl shadow-2xl w-[480px] p-10 text-center relative">
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <p className="text-xl font-semibold mb-10">
              정말 탈퇴하시겠습니까?
            </p>

            <div className="flex justify-center gap-8">
              <button
                onClick={handleConfirmDelete}
                className="bg-gray-300 text-black text-base px-8 py-3 rounded-md hover:bg-gray-400 transition-colors"
              >
                예
              </button>
              <button
                onClick={handleCancel}
                className="bg-[#f72585] text-white text-base px-8 py-3 rounded-md hover:brightness-90 transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
