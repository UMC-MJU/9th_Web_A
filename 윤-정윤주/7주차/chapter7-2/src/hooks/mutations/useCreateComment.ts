// src/hooks/mutations/useCreateComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../apis/comment";

function useCreateComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createComment,
        onSuccess: () => {
        // 댓글 목록 invalidate
        queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
        },
    });
}

export default useCreateComment;
