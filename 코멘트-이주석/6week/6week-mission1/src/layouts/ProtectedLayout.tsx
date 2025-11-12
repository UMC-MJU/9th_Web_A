import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={"/login"} state={{ location }} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <nav>
        <Navbar />
      </nav>
      <main className="flex-grow pt-[72px]">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
