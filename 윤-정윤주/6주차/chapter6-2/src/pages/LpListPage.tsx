import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { Lp } from "../types/lp";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";

export default function LpListPage() {
  const [order, setOrder] = useState<"newest" | "oldest">("newest");

  const apiOrder =
    order === "newest" ? PAGINATION_ORDER.DESC : PAGINATION_ORDER.ASC;

  const { data, isLoading, isError, refetch } = useGetLpList({
    cursor: 0,
    search: "",
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

  if (isError || lpList.length === 0) {
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
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => setOrder("oldest")}
          className={`px-4 py-2 rounded ${
            order === "oldest"
              ? "bg-pink-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder("newest")}
          className={`px-4 py-2 rounded ${
            order === "newest"
              ? "bg-pink-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          최신순
        </button>
      </div>

      {/* LP 카드 목록 */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {lpList.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
      </div>
    </div>
  );
}