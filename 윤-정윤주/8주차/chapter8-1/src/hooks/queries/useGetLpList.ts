import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search = "", order = "desc", limit }: PaginationDto) {
    // 검색어 정규화: 앞뒤 공백 제거
    const trimmedSearch = search.trim();
    
    return useQuery({
        queryKey: [QUERY_KEY.lps, trimmedSearch, order, cursor, limit],
        queryFn: () =>
            getLpList({
                cursor,
                search: trimmedSearch,
                order,
                limit,
            }),
        // 빈 문자열이거나 공백만 있을 때는 전체 목록 조회 (enabled: true)
        // 검색어가 있을 때만 조회하려면: enabled: trimmedSearch.length > 0
        enabled: true,
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
        retry: 2, // 실패 시 최대 2번 자동 재시도
        refetchOnWindowFocus: false, // 창 포커스 시 재요청 방지
        placeholderData: (prev) => prev, // order 변경 시 이전 데이터 유지
        select: (data) => data.data.data,
    });
}

export default useGetLpList;
