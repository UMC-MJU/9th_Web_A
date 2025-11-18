import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../apis/Ip";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, order],
    enabled: true,

    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage, allPages);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },

    staleTime: 1000 * 10,
    gcTime: 1000 * 10,
  });
}

export default useGetInfiniteLpList;
