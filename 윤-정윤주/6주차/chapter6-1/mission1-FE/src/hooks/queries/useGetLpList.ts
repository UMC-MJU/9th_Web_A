import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search = "", order = "desc", limit }: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, search, order],
        queryFn: () =>
        getLpList({
            cursor,
            search,
            order,
            limit,
        }),
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
        retry: 2, // 실패 시 최대 2번 자동 재시도
        placeholderData: (prev) => prev, // order 변경 시 이전 데이터 유지
        select: (data) => data.data.data,
    });
}

export default useGetLpList;
