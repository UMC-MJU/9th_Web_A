import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";

function usePostLike() {
    return useMutation({
        mutationFn: postLike,
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

export default usePostLike;