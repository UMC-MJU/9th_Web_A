import { Link } from "react-router-dom";
import { useSidebarContext } from "../context/SidebarContext";
import { useEffect } from "react";

const Sidebar = () => {
  const { isOpen, close } = useSidebarContext();

  // ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 메모리 누수 방지: 언마운트 시 clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  return (
    <aside
      className={`
        fixed top-16 left-0 z-40
        w-60 h-[calc(100vh-4rem)]
        bg-[#141414] text-white
        flex flex-col justify-between
        px-6 py-8 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <nav className="flex flex-col gap-6">
        <Link to="/search" onClick={close} className="hover:text-pink-400">
          찾기
        </Link>

        <Link to="/my" onClick={close} className="hover:text-pink-400">
          마이페이지
        </Link>
      </nav>

      <div className="border-t pt-6">
        <button
          onClick={close}
          className="text-sm text-gray-400 hover:text-red-400"
        >
          탈퇴하기
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
