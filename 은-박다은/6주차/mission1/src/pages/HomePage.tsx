// src/pages/HomePage.tsx
import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import type { PAGINATION_ORDER } from "../enums/common";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>("desc"); // 기본: 최신순

  const { data, isPending, isError, refetch } = useGetLpList({
    cursor: 0,
    limit: 20,
    search,
    order,
  });

  const lpList = data?.data.data ?? [];

  const toggleOrder = () => {
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="min-h-screen bg-black text-white pl-64 pr-6 pt-20">
      <div className="flex items-center gap-4 mb-6">
        {/* 정렬 토글 버튼 */}
        <button
          onClick={toggleOrder}
          className="px-4 py-2 rounded-md border border-gray-600 hover:border-pink-500 hover:text-pink-400 transition"
        >
          {order === "desc" ? "최신순" : "오래된순"}
        </button>
      </div>

      {/* 로딩 상태 */}
      {isPending && (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-md bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="text-center mt-10">
          <p className="mb-4 text-red-400">
            목록을 불러오는 중 오류가 발생했어요.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600"
          >
            다시 시도하기
          </button>
        </div>
      )}

      {/* 정상 데이터 */}
      {!isPending && !isError && (
        <div className="grid grid-cols-4 gap-4">
          {lpList.map((lp) => (
            <div
              key={lp.id}
              className="bg-[#141414] rounded-lg p-3 hover:-translate-y-1 hover:shadow-lg transition"
            >
              <div className="h-32 bg-gray-700 rounded mb-2" />
              <h2 className="text-sm font-semibold truncate">{lp.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
