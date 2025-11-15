import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order, search],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    // enabled: Boolean(search),
    refetchInterval: 100 * 60,
    // keepPreviousData: true,

    select: (data) => data.data,
  });
}

export default useGetLpList;
