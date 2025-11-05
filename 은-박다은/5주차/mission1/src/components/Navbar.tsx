import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-[#141414] text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-pink-500 font-bold text-lg">들려들려LP판</h1>

      <div className="flex gap-4">
        <Link to="/login" className="hover:text-pink-400 transition">
          로그인
        </Link>
        <Link
          to="/signup"
          className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 transition"
        >
          회원가입
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
