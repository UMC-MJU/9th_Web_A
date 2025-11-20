// src/hooks/mutations/useDeleteComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comment";

function useDeleteComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
        // 댓글 목록 invalidate
        queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
        },
    });
}

export default useDeleteComment;
