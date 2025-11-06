import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useNavigate } from "react-router-dom";

export default function LpListPage() {
  const navigate = useNavigate();

  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const apiOrder =
    order === "newest" ? PAGINATION_ORDER.DESC : PAGINATION_ORDER.ASC;

  const { data, isLoading, isError, refetch } = useGetLpList({
    cursor: 0,
    search: "",
    order: apiOrder,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-700 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white">
        <p className="text-red-500 mb-3">목록을 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-pink-500 text-white hover:bg-pink-600 transition"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-6">
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-3 mb-5">
        <button
          onClick={() => setOrder("oldest")}
          className={`px-5 py-2 text-sm font-semibold transition ${
            order === "oldest"
              ? "bg-pink-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("newest")}
          className={`px-5 py-2 text-sm font-semibold transition ${
            order === "newest"
              ? "bg-pink-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          최신순
        </button>
      </div>

      {/* 썸네일 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {data?.map((lp: any) => {
          const imageUrl = lp.thumbnail?.startsWith("http")
            ? lp.thumbnail
            : `${import.meta.env.VITE_API_URL}${lp.thumbnail}`;

          return (
            <div
              key={lp.id}
              onClick={() => navigate(`/v1/lps/${lp.id}`)}
              className="relative aspect-square cursor-pointer overflow-hidden border border-transparent hover:border-red-500 hover:border-4 transition-all duration-300"
            >
              <img
                src={imageUrl || "/placeholder.jpg"}
                alt={lp.title}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
