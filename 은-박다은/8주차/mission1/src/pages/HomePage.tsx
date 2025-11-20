import { useEffect, useRef, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "../components/LpCard";
import LpCardSkeleton from "../components/LpCardSkeleton";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";
import useDebounce from "../hooks/useDebounce";
import useThrottleFn from "../hooks/useThrottle";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search ?? "", SEARCH_DEBOUNCE_DELAY);

  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetInfiniteLpList(12, debouncedValue, order);

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showNextSkeleton, setShowNextSkeleton] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 800);
    return () => clearTimeout(timer);
  }, []);

  //  스크롤 시 스켈레톤 0.5초 유지
  useEffect(() => {
    if (isFetchingNextPage) {
      setShowNextSkeleton(true);
      const timer = setTimeout(() => setShowNextSkeleton(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isFetchingNextPage]);

  const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];

  const throttledFetchNextPage = useThrottleFn(() => {
    if (hasNextPage) fetchNextPage();
  }, 500);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          throttledFetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [throttledFetchNextPage]);

  return (
    <div className="min-h-screen bg-black text-white px-8 pb-10 pl-64">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="mt-8 w-[280px] mx-auto block bg-[#1f1f1f] text-white px-4 py-2
    rounded-lg border border-gray-700 focus:border-pink-500 outline-none transition"
      />

      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-6 mt-6">
        <div className="inline-flex rounded-md overflow-hidden border border-gray-600">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.ASC)}
            className={`px-4 py-1.5 text-sm transition-all duration-200 ${
              order === PAGINATION_ORDER.ASC
                ? "bg-pink-600 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.DESC)}
            className={`px-4 py-1.5 text-sm transition-all duration-200 ${
              order === PAGINATION_ORDER.DESC
                ? "bg-pink-600 text-white"
                : "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 카드 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {(isPending || showSkeleton) &&
          Array.from({ length: 10 }).map((_, i) => <LpCardSkeleton key={i} />)}

        {lpList.map((lp) => (
          <LpCard key={lp.id} lp={lp} />
        ))}

        {(isFetchingNextPage || showNextSkeleton) &&
          Array.from({ length: 4 }).map((_, i) => (
            <LpCardSkeleton key={`next-${i}`} />
          ))}
      </div>

      <div ref={observerRef} className="h-12" />
    </div>
    //   <div className="p-6 space-y-4">
    //     {[...Array(20)].map((_, i) => (
    //       <p key={i}>
    //         Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, quam
    //         commodi? Autem accusamus molestias quod. Fugit excepturi
    //         exercitationem, consequuntur rerum, repellat nemo vel esse architecto
    //         nihil, amet voluptatibus molestiae?
    //       </p>
    //     ))}
    //   </div>
  );
};

export default HomePage;
