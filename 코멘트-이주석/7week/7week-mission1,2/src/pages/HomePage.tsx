import { useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import LpListPage from "./LpListPage";

const HomePage = () => {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-6 space-x-2">
        <button
          className={`px-4 py-2 rounded border ${
            order === "desc"
              ? "bg-pink-500 text-white"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setOrder("desc")}
        >
          최신순
        </button>
        <button
          className={`px-4 py-2 rounded border ${
            order === "asc"
              ? "bg-pink-500 text-white"
              : "bg-gray-800 text-white"
          }`}
          onClick={() => setOrder("asc")}
        >
          오래된순
        </button>
      </div>

      {/* LP 목록 */}
      <LpListPage
        order={order === "asc" ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc}
      />
    </div>
  );
};

export default HomePage;
