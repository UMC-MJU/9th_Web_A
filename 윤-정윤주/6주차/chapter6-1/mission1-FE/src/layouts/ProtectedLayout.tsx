import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProtectedLayout = () => {   // 토큰이 유효할 때만 접근 가능한 레이아웃
    const { accessToken } = useAuth();

    if(!accessToken) {
        return <Navigate to={"/login"} replace />;  // 히스토리에 남기지 않음
    }

    return (
        <div className="h-dvh flex flex-col">
            <Navbar />
            <main className="flex-1 mt-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ProtectedLayout;