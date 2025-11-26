// src/pages/LpListPage.tsx
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import type { LpData } from "../types/lp";
import { PAGINATION_ORDER } from "../enums/common";
import useThrottleFn from "../hooks/useThrottleFn";

interface LpListPageProps {
  order: PAGINATION_ORDER;
  searchQuery?: string;
}

const LpListPage = ({ order, searchQuery = "" }: LpListPageProps) => {
  const enabled = true;

  // 🔥 마지막 카드 감지
  const { ref, inView } = useInView({
    threshold: 0, // 하단 감지
    rootMargin: "0px 0px -30% 0px", // 화면 아래 70%까지 내려와야 감지됨
  });

  // 🔥 TanStack Query 무한스크롤
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["lps", order, searchQuery],
    enabled,

    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosInstance.get(
        `/v1/lps?cursor=${pageParam}&limit=20&order=${order}&search=${searchQuery}`
      );

      const page = res.data.data;

      return {
        items: page.data,
        nextCursor: page.nextCursor,
        hasNext: page.hasNext,
      };
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  // 🔥 진짜 throttle 적용 (2초 간격)
  const throttledFetch = useThrottleFn(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, 2000);

  // inView 변화 감지 시 throttle된 fetch 실행
  useEffect(() => {
    if (inView) throttledFetch();
  }, [inView, throttledFetch]);

  // 로딩 상태
  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <LpCardSkeletonList count={20} />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-400">
        LP 목록을 불러오지 못했습니다.
      </div>
    );

  // 페이지 데이터 합침
  const lps: LpData[] = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {lps.map((lp, index) => {
        const isLast = index === lps.length - 1;

        return (
          <div key={lp.id} ref={isLast ? ref : undefined}>
            <LpCard lp={lp} />
          </div>
        );
      })}

      {/* 다음 로딩 skeleton */}
      {isFetchingNextPage && <LpCardSkeletonList count={4} />}
    </div>
  );
};

export default LpListPage;
