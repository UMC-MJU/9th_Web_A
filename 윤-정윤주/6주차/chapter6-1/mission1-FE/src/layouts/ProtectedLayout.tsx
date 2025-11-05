import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {   // 토큰이 유효할 때만 접근 가능한 레이아웃
    const { accessToken } = useAuth();

    if(!accessToken) {
        return <Navigate to={"/login"} replace />;  // 히스토리에 남기지 않음
    }

    return <Outlet />;   // 토큰이 유효하면 하위 라우트 렌더링
};

export default ProtectedLayout;