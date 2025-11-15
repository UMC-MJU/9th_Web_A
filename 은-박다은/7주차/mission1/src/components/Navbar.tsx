import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { getMyInfo } from "../apis/auth";
import { useMutation } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [nickname, setNickname] = useState("사용자");

  const isLoggedIn = Boolean(accessToken);

  useEffect(() => {
    if (!accessToken) {
      setNickname("사용자");
      return;
    }

    const fetchMyInfo = async () => {
      try {
        const res = await getMyInfo();
        setNickname(res.data?.name || "사용자");
      } catch (e) {
        console.error("내 정보 불러오기 실패", e);
        setNickname("사용자");
      }
    };

    fetchMyInfo();
  }, [accessToken]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/login");
    },
  });

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#141414] text-white shadow-md z-50">
        <div className="flex justify-between items-center px-6 py-4">
          {/* 왼쪽: 햄버거 + 로고 */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-gray-800 rounded"
              onClick={() => setSidebarOpen((p) => !p)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M7.95 11.95h32m-32 12h32m-32 12h32"
                />
              </svg>
            </button>

            <Link to="/" className="text-lg font-bold text-pink-500">
              돌려돌려LP판
            </Link>
          </div>

          {/* 오른쪽: 검색 + 로그인/회원가입 */}
          <div className="flex items-center gap-4 text-sm">
            {/* 🔍 검색 버튼 */}
            <button
              onClick={() => navigate("/search")}
              className="p-2 hover:text-pink-400 transition"
              aria-label="검색"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>

            {isLoggedIn ? (
              <>
                <span className="hidden sm:block text-gray-300">
                  {nickname}님 반갑습니다 👋
                </span>
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="hover:text-pink-400 transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-pink-400 transition">
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="bg-pink-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-pink-600 transition"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar 항상 렌더링 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
