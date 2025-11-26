// HomePage.tsx
import { useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import LpListPage from "./LpListPage";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 검색 input */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
      />

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

      <LpListPage
        order={order === "asc" ? PAGINATION_ORDER.asc : PAGINATION_ORDER.desc}
        searchQuery={debouncedQuery}
      />
    </div>
  );
};

export default HomePage;
