import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import type { PAGINATION_ORDER } from "../enums/common";

const HomePage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<PAGINATION_ORDER>("desc");

  const { data, isPending, isError } = useGetLpList({ order, limit: 20 });
  const lpList = data?.data.data ?? [];

  if (isPending)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        불러오는 중...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400">
        오류가 발생했습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-8 pb-10 pl-64">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-6 mt-6">
        <div className="inline-flex rounded-md overflow-hidden border border-gray-600">
          <button
            onClick={() => setOrder("asc")}
            className={`px-4 py-1.5 text-sm transition-all duration-200 ${
              order === "asc"
                ? "bg-pink-600 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder("desc")}
            className={`px-4 py-1.5 text-sm transition-all duration-200 ${
              order === "desc"
                ? "bg-pink-600 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* LP 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {lpList.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-[#141414] shadow-md transition-transform duration-300 hover:scale-105"
          >
            {/* 썸네일 */}
            <img
              src={lp.thumbnail || "/default_cover.jpg"}
              alt={lp.title || "lp cover"}
              className="w-full h-56 object-cover"
            />

            {/* Hover 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-80 group-hover:bg-opacity-0 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-70">
              <h3 className="text-sm font-semibold truncate mb-1">
                {lp.title || "제목 없음"}
              </h3>
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  {lp.createdAt
                    ? new Date(lp.createdAt).toLocaleDateString()
                    : "날짜 없음"}
                </span>
                <span>❤️ {lp.likes?.length ?? 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
