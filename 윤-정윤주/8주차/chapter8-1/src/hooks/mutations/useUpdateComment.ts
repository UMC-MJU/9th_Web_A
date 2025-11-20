// src/hooks/mutations/useUpdateComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/comment";

function useUpdateComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
            updateComment({ lpId, commentId, content }),
        onSuccess: () => {
        // 댓글 목록 invalidate
        queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
        },
    });
}

export default useUpdateComment;
