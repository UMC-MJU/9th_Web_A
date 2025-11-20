import { Link } from "react-router-dom";
import { useSidebarContext } from "../context/SidebarContext";
import { useEffect } from "react";

const Sidebar = () => {
  const { isOpen, close } = useSidebarContext();

  // ESC
  useEffect(() => {
    // ESC 키 닫기 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);

    const main = document.querySelector("main");

    if (isOpen) {
      // body 스크롤 방지
      document.body.style.overflow = "hidden";

      // main 스크롤 방지 (무한스크롤이 여기서 멈춤)
      if (main) main.style.overflow = "hidden";
    } else {
      // body 스크롤 복구
      document.body.style.overflow = "auto";

      // main 스크롤 복구 (무한스크롤 정상 재작동)
      if (main) main.style.overflow = "auto";
    }

    // cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";

      if (main) main.style.overflow = "auto";
    };
  }, [isOpen, close]);

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
