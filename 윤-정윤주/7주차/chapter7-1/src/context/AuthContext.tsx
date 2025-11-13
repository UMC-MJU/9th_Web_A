import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    setAccessToken?: (token: string | null) => void;
    setRefreshToken?: (token: string | null) => void;
    login: (signinData: RequestSigninDto) => Promise<string | false>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => false,
    logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { getItem: getAccessTokenFromStorage, setItem: setAccessTokenInStorage, removeItem: removeAccessTokenFromStorage } =
        useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const { getItem: getRefreshTokenFromStorage, setItem: setRefreshTokenInStorage, removeItem: removeRefreshTokenFromStorage } =
        useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());

    const login = async (signinData: RequestSigninDto): Promise<string | false> => {
        try {
            const { data } = await postSignin(signinData);

            if (data) {
                setAccessTokenInStorage(data.accessToken);
                setRefreshTokenInStorage(data.refreshToken);
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);

                alert("로그인 성공");

                const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
                sessionStorage.removeItem("redirectAfterLogin");
                return redirectPath;
            }
            return false;
        } catch (error) {
            console.error("로그인 오류", error);
            alert("로그인 실패");
            return false;
        }
    };

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            setAccessToken(null);
            setRefreshToken(null);
        } catch (error) {
            console.error("로그아웃 오류", error);
            alert("로그아웃 실패");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                setAccessToken,
                setRefreshToken,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthContext를 찾을 수 없습니다.");
    return context;
};
