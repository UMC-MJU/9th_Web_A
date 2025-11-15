import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

export const useComment = (lpId: number) => {
  const queryClient = useQueryClient();

  /** ✅ 댓글 작성 */
  const writeComment = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });

  /** ✅ 댓글 수정 */
  const editComment = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const { data } = await axiosInstance.patch(
        `/v1/lps/${lpId}/comments/${commentId}`,
        { content }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });

  /** ✅ 댓글 삭제 */
  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });

  return { writeComment, editComment, deleteComment };
};
