import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common";
import { getComments } from "../../apis/comment";

function useGetInfiniteCommentList(
    lpId: number,
    limit: number,
    order: PAGINATION_ORDER
) {
    return useInfiniteQuery({
        queryKey: ['lpComments', lpId, order] as const,
        queryFn: ({ pageParam = 0 }) =>
        getComments({ lpId, cursor: pageParam, limit, order }),

        initialPageParam: 0,

        getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
    });
}

export default useGetInfiniteCommentList;