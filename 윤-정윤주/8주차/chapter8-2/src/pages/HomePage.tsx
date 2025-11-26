import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletionList";
import { useThrottleCallback } from "../hooks/useThrottleCallback";

const HomePage = () => {
  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, "", PAGINATION_ORDER.ASC);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // callback-throttle 적용: 1초 간격으로 fetchNextPage 제한
  const throttledFetch = useThrottleCallback(() => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
      console.log("fetchNextPage 호출:", new Date().toLocaleTimeString());
    }
  }, 100);


  useEffect(() => {
    if (inView) throttledFetch();
  }, [inView, throttledFetch]);

  if (isError) return <div className="mt-20">Error</div>;

  return (
    <div className="p-5 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 초기 로딩 스켈레톤 (상단) */}
        {isPending && <LpCardSkeletonList count={20}/>}
        
        {/* 실제 데이터 */}
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        
        {/* 추가 로딩 스켈레톤 (하단) */}
        {isFetchingNextPage && <LpCardSkeletonList count={10}/>}
      </div>
      
      {hasNextPage && (
        <div ref={ref} className="py-10 text-center" />
      )}
    </div>
  );
};

export default HomePage;