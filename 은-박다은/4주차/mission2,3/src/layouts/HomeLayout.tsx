import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <nav className="w-full bg-[#141414] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-pink-500 font-bold text-lg">들려들려LP판</h1>

        <div className="flex gap-4">
          <button className="hover:text-pink-400 transition">로그인</button>
          <button className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 transition">
            회원가입
          </button>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="w-full bg-[#141414] text-gray-400 text-center py-6 mt-auto">
        <p className="text-sm">© eun 들려들려LP판. </p>
      </footer>
    </div>
  );
};

export default HomeLayout;
