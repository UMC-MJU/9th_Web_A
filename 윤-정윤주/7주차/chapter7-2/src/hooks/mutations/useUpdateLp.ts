// src/hooks/mutations/useUpdateLp.ts
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { axiosInstance } from "../../apis/axios";

export const updateLp = async ({
    lpId,
    title,
    content,
    thumbnail,
    tags,
    }: {
    lpId: number;
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    }) => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, {
        title,
        content,
        thumbnail,
        tags,
        published: true,
    });
    return data.data;
};

export function useUpdateLp(lpId: number) {
    return useMutation({
        mutationFn: updateLp,
        onSuccess: () => {
        // 해당 LP 상세 정보를 다시 fetch
        queryClient.invalidateQueries({ queryKey: ["lp", String(lpId)] });
        // LP 목록도 invalidate (목록에서도 업데이트 반영)
        queryClient.invalidateQueries({ queryKey: ["lps"] });
        },
        onError: (error) => {
        console.error("LP 수정 실패:", error);
        alert("LP 수정 중 오류가 발생했습니다.");
        },
    });
}