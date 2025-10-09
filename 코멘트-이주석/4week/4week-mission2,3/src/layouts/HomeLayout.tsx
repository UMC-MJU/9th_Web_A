import { Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* 네비게이션 바 */}
      <nav className="flex justify-between items-center px-8 py-4 bg-[#141414] text-white">
        <h1 className="text-lg font-bold text-[#f72585]">돌려돌려LP판</h1>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="bg-black border border-white text-white px-3 py-1 rounded-md text-sm hover:bg-white hover:text-black transition-colors"
          >
            로그인
          </Link>
          <button className="bg-[#f72585] px-3 py-1 rounded-md text-sm font-semibold hover:bg-pink-600 transition-colors">
            회원가입
          </button>
        </div>
      </nav>

      {/* 페이지 콘텐츠 */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
