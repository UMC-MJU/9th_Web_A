import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto>([]);

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);

            setData(response);
        };
        
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    }
    
    console.log(data.data?.name);  // 데이터가 비동기로 오기 때문에 처음엔 undefined
    return (
        <div>
            <h1>{data.data?.name}님 환영합니다.</h1>
            <img src={data.data?.avatar as string} alt="프로필 이미지" />
            <h1>{data.data?.email}</h1>

            <button 
                className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
                onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default MyPage;