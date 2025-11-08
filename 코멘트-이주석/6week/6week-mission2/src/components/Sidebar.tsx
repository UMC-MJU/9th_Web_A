import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* ✅ 반투명 오버레이 (Navbar 덮지 않도록 top-[64px]) */}
      {isOpen && (
        <div
          className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black/40 z-[45]"
          onClick={onClose}
        />
      )}

      {/* ✅ Sidebar 본체 */}
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
          <p className="text-white text-xs cursor-pointer hover:text-[#f72585] transition-colors">
            탈퇴하기
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
