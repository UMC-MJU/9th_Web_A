import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <Navbar />

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
