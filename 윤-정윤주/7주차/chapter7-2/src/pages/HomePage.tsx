import { useEffect, useState } from "react";
// import useGetLpList from "../hooks/queries/useGetLpList";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletionList";

const HomePage = () => {
  const [search, setSearch] = useState("");

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, search, PAGINATION_ORDER.ASC)

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isError) {
    return <div className="mt-20">Error</div>;
  }

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