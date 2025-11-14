// src/hooks/mutations/useDeleteLp.ts
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { axiosInstance } from "../../apis/axios";
import { QUERY_KEY } from "../../constants/key";

export const deleteLp = async ({ lpId }: { lpId: number }) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
    return data.data; // 스웨거 기준: data.data = true
    };

    export function useDeleteLp() {
    return useMutation({
        mutationFn: deleteLp,
        onSuccess: () => {
        // 삭제 후 LP 목록 새로고침
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
        },
        onError: (error) => {
        console.error("LP 삭제 실패:", error);
        alert("LP 삭제 중 오류가 발생했습니다.");
        },
    });
}
