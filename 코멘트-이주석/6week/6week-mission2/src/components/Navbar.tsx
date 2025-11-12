import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { FiSearch } from "react-icons/fi";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) return;
      try {
        const response: ResponseMyInfoDto = await getMyInfo();
        setUserName(response.data?.name ?? "사용자");
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };
    fetchUser();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full fixed top-0 left-0 z-[60] bg-[#141414] border-b border-white/10 text-white">
      <nav className="flex justify-between items-center w-full px-8 py-4">
        <div className="flex items-center">
          {/* 버거 버튼 */}
          <button
            className="ml-4 mr-4 text-white hover:opacity-80 transition-opacity"
            onClick={onToggleSidebar}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          {/* 로고 텍스트 */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-[#f72585] tracking-tight hover:opacity-90 transition-opacity"
          >
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex items-center gap-4 text-sm mr-4">
          {!accessToken ? (
            <>
              {/* 검색 아이콘 */}
              <Link to="/" className="hover:text-[#f72585] transition-colors">
                <FiSearch size={20} />
              </Link>

              {/* 로그인 */}
              <Link
                to="/login"
                className="text-white px-3 py-1 hover:text-[#f72585] transition-colors"
              >
                로그인
              </Link>

              {/* 회원가입 */}
              <Link
                to="/signup"
                className="bg-[#f72585] px-3 py-1 rounded-md font-semibold hover:bg-pink-600 transition-colors"
              >
                회원가입
              </Link>
            </>
          ) : (
            <>
              {/* 로그인 상태 */}
              <FiSearch size={18} />
              <span className="text-white mr-1 whitespace-nowrap">
                {userName ? `${userName}님 반갑습니다.` : "환영합니다."}
              </span>

              <button
                onClick={handleLogout}
                className="text-white px-3 py-1 hover:text-[#f72585] transition-colors"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
