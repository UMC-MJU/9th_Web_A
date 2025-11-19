import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpComments } from "../../apis/Ip";
import type { PAGINATION_ORDER } from "../../enums/common";

export function useGetInfiniteComments(
  lpId: number,
  order: PAGINATION_ORDER,
  limit = 20
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],

    queryFn: ({ pageParam = 0 }) =>
      getLpComments({
        lpId,
        cursor: pageParam,
        limit,
        order,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}
