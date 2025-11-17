import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
    limit: number,
    search: string,
    order: PAGINATION_ORDER,
) {
    // 검색어 정규화: 앞뒤 공백 제거
    const trimmedSearch = search.trim();
    
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, "infinite", trimmedSearch, order, limit],
        queryFn: ({ pageParam }) =>
            getLpList({ 
                cursor: pageParam, 
                limit, 
                search: trimmedSearch, 
                order 
            }),
        // 빈 문자열이거나 공백만 있을 때는 전체 목록 조회 (enabled: true)
        // 검색어가 있을 때만 조회하려면: enabled: trimmedSearch.length > 0
        enabled: true,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        // 캐시 최적화
        staleTime: 1000 * 60 * 5, // 5분간 fresh 상태 유지
        gcTime: 1000 * 60 * 10, // 10분간 캐시 보관
        // 재요청 설정
        refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
        retry: 1, // 실패 시 1번만 재시도
    });
}

export default useGetInfiniteLpList;