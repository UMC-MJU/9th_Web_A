import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const { accessToken, logout } = useAuth();
    
    // React Query로 사용자 정보 가져오기 (낙관적 업데이트 자동 반영)
    const { data } = useGetMyInfo(accessToken);
    const nickname = data?.data?.name ?? "사용자";

    // useMutation으로 로그아웃 처리
    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
        alert("로그아웃 성공!");
        navigate("/login", { replace: true });
        },
        onError: (error) => {
        console.error("로그아웃 실패", error);
        alert("로그아웃 실패");
        },
    });

    return (
        <>
        <nav className="fixed top-0 left-0 w-full bg-[#0D1117] text-white shadow-md z-50">
            <header className="flex items-center justify-between px-6 py-4 bg-gray-900">
            <div className="flex items-center gap-3">
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-800 rounded" aria-label="메뉴 열기/닫기">
                <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
                </svg>
                </button>
                <Link to="/" className="text-lg font-bold text-pink-500">돌려돌려LP판</Link>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/search")} className="p-2 hover:bg-gray-800 rounded" aria-label="검색으로 이동">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                </button>

                {accessToken ? (
                <>
                    <span className="hidden sm:block text-sm md:text-base text-gray-300">{nickname}님 반갑습니다 👋</span>
                    <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="text-white hover:text-pink-400 transition"
                    >
                    {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                    </button>
                </>
                ) : (
                <>
                    <Link to="/login" className="text-white hover:text-pink-400 transition">로그인</Link>
                    <Link to="/signup" className="bg-pink-500 text-white px-4 py-1.5 rounded-full font-medium hover:bg-pink-600 transition">회원가입</Link>
                </>
                )}
            </div>
            </header>
        </nav>

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </>
    );
};

export default Navbar;