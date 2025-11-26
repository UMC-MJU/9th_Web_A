import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { Lp } from "../types/lp";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

export default function LpListPage() {
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_DELAY);

  const apiOrder =
    order === "newest" ? PAGINATION_ORDER.DESC : PAGINATION_ORDER.ASC;

  const { data, isLoading, isError, refetch } = useGetLpList({
    cursor: 0,
    search: debouncedSearch,
    order: apiOrder,
    limit: 20,
  });

  const lpList: Lp[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data?.data)
    ? (data as any).data.data
    : [];

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="relative overflow-hidden">
              <LpCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5 text-center">
        <p className="text-red-500 mb-2">LP 목록을 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-pink-500 text-white rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* 검색창과 정렬 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-auto sm:flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="LP 제목 검색..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-pink-500"
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setOrder("oldest")}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              order === "oldest"
                ? "bg-pink-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder("newest")}
            className={`px-4 py-2 rounded whitespace-nowrap ${
              order === "newest"
                ? "bg-pink-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* LP 카드 목록 */}
      {lpList.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">
            {debouncedSearch 
              ? `"${debouncedSearch}"에 대한 검색 결과가 없습니다.` 
              : "LP 목록이 없습니다."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {lpList.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}
    </div>
  );
}