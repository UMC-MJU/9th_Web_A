import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";

function useDeleteLike() {
    return useMutation({
        mutationFn: deleteLike,
        onSuccess: (data) => {
            // LP 상세 페이지 쿼리 invalidate
            queryClient.invalidateQueries({
                queryKey: ["lp", String(data.data.lpId)],
            });
            // LP 목록 페이지도 invalidate (좋아요 수 반영)
            queryClient.invalidateQueries({
                queryKey: ["lps"],
            });
        },
    });
}

export default useDeleteLike;