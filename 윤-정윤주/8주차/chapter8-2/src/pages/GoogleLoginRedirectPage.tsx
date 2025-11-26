import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

const GoogleLoginRedirectPage = () => {
    const { setAccessToken: setContextAccessToken, setRefreshToken: setContextRefreshToken } = useAuth();
    const { setItem: setAccessTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);

        if (accessToken && refreshToken) {
            // 1️⃣ localStorage 업데이트
            setAccessTokenStorage(accessToken);
            setRefreshTokenStorage(refreshToken);

            // 2️⃣ Context 업데이트
            setContextAccessToken?.(accessToken);
            setContextRefreshToken?.(refreshToken);

            // 3️⃣ 로그인 전 페이지로 리다이렉트
            const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath, { replace: true });
        }
    }, [
        setAccessTokenStorage, 
        setRefreshTokenStorage, 
        setContextAccessToken, 
        setContextRefreshToken, 
        navigate
    ]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin w-10 h-10 mx-auto mb-3 border-4 border-t-pink-500 border-gray-300 rounded-full"></div>
                <p className="text-gray-400">로그인 처리 중...</p>
            </div>
        </div>
    );
};

export default GoogleLoginRedirectPage;
