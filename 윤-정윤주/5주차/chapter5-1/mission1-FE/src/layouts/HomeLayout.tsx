import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav className="text-blue-600 px-6 py-4 flex justify-between items-center">
                <Link
                    to="/"
                    className="text-xl font-bold hover:text-blue-700 transition"
                >
                    UMC
                </Link>

                <div className="flex gap-2">
                    <Link
                        to="/login"
                        className="border border-blue-600 text-blue-600 bg-white px-3 py-1 rounded-md text-sm hover:bg-blue-50 transition"
                    >
                        로그인
                    </Link>
                    <Link
                        to="/signup"
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                    >
                        회원가입
                    </Link>
                </div>
            </nav>
            <main className="flex-1">
                {/* Outlet: 라우터의 children 경로가 여기에 렌더링 */}
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;