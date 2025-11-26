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
        <Link
          to="/search"
          onClick={close}
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
          onClick={close}
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
