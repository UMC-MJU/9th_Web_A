import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    // 로그인 전 페이지 저장 및 Modal 표시
    useEffect(() => {
        // 로그인 리다이렉트 페이지에서는 모달을 표시하지 않도록 예외 처리 추가!
        const isGoogleRedirect = location.pathname.includes('/google-login-redirect');
        
        if (!accessToken && location.pathname !== '/login' && !isGoogleRedirect) { 
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            setShowModal(true);
        } else if (accessToken) {
            setShowModal(false);
        }
    }, [accessToken, location.pathname]);

    // Modal 확인 클릭 시
    const handleConfirm = () => {
        setShowModal(false);
        setRedirectToLogin(true);
    };

    // 로그인 없고 확인 클릭 시 /login으로 이동
    if (!accessToken && redirectToLogin) {
        return <Navigate to="/login" replace />;
    }

    // 로그인 필요 Modal
    if (!accessToken && showModal) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">로그인 필요</h2>
                    <p className="text-gray-600 mb-6">
                        이 페이지는 로그인이 필요합니다.
                        <br />
                        로그인 페이지로 이동하시겠습니까?
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleConfirm}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 로그인 상태면 정상 렌더
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
