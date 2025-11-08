import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import type { LpData } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";

interface LpListPageProps {
  order: PAGINATION_ORDER;
}

const LpListPage = ({ order }: LpListPageProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["lps", order],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosInstance.get(
        `/v1/lps?cursor=${pageParam}&limit=10&order=${order}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined,
  });

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <LpCardSkeletonList count={8} />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-400">
        LP 목록을 불러오지 못했습니다.
      </div>
    );

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <>
      {/* LP 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lps.map((lp: LpData) => (
          <LpCard key={lp.id} lp={lp} />
        ))}

        {/* 아래쪽 Skeleton */}
        {isFetchingNextPage && <LpCardSkeletonList count={4} />}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10 flex justify-center items-center mt-4">
        {isFetchingNextPage && (
          <span className="text-gray-400">Loading more…</span>
        )}
      </div>
    </>
  );
};

export default LpListPage;
