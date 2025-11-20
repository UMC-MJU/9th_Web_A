import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import type { Lp } from "../../types/lp";

function useDeleteLike(currentUserId?: number) {
    return useMutation({
        mutationFn: deleteLike,
        
        // 낙관적 업데이트: 서버 요청 전에 실행
        onMutate: async ({ lpId }) => {
            // 1. 진행 중인 쿼리 취소
            await queryClient.cancelQueries({ 
                queryKey: ["lp", String(lpId)] 
            });

            // 2. 이전 데이터 백업
            const previousLp = queryClient.getQueryData<Lp>([
                "lp", 
                String(lpId)
            ]);

            // 3. 즉시 UI 업데이트
            if (previousLp && currentUserId) {
                queryClient.setQueryData<Lp>(
                    ["lp", String(lpId)],
                    (old) => {
                        if (!old) return old;
                        
                        return {
                            ...old,
                            // 현재 사용자의 좋아요 제거
                            likes: old.likes.filter(
                                like => like.userId !== currentUserId
                            )
                        };
                    }
                );
            }

            // 4. 백업 데이터 반환
            return { previousLp };
        },

        // 에러 발생 시: 롤백
        onError: (error, { lpId }, context) => {
            if (context?.previousLp) {
                queryClient.setQueryData(
                    ["lp", String(lpId)],
                    context.previousLp
                );
            }
        },

        // 성공 시: 서버 데이터로 동기화
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["lp", String(data.data.lpId)],
            });
            queryClient.invalidateQueries({
                queryKey: ["lps"],
            });
        },
    });
}

export default useDeleteLike;