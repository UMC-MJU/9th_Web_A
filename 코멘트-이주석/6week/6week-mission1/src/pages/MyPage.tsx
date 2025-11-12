import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDto>([]);
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, [navigate]);

  return (
    <div className="text-white">
      <img src={data.data?.avatar as string} alt={"구글 로고"} />
      <h1>{data.data?.name}님, 환영합니다.</h1>
      <h1>{data.data?.email}</h1>
    </div>
  );
};
