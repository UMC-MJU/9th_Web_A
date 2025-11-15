import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteClick: () => void;
}

const Sidebar = ({ isOpen, onClose, onDeleteClick }: SidebarProps) => {
  return (
    <aside
      className={`
        fixed top-16 left-0 z-40
        w-60 h-[calc(100vh-4rem)]
        bg-[#141414] text-white
        flex flex-col justify-between
        px-6 py-8 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
       ${
         isOpen
           ? "translate-x-0 md:translate-x-0"
           : "-translate-x-full md:-translate-x-full"
       }


      `}
    >
      <nav className="flex flex-col gap-6">
        <Link
          to="/search"
          onClick={onClose}
          className="flex items-center gap-3 text-base hover:text-pink-400 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span>찾기</span>
        </Link>

        <Link
          to="/my"
          onClick={onClose}
          className="flex items-center gap-3 text-base hover:text-pink-400 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            fill="none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12zm0 2c-3.3 0-6.5 1.7-6.5 4v1h13v-1c0-2.3-3.2-4-6.5-4z"
            />
          </svg>
          <span>마이페이지</span>
        </Link>
      </nav>

      <div className="border-t border-gray-800 pt-6">
        <button
          onClick={onDeleteClick}
          className="text-sm text-gray-400 hover:text-red-400 text-left w-full"
        >
          탈퇴하기
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
