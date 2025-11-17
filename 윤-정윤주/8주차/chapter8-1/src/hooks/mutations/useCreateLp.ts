// src/hooks/mutations/useCreateLp.ts
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { createLp } from "../../apis/lp";
import { uploadImage } from "../../apis/image";

export function useCreateLp(onClose: () => void) {
  return useMutation({
    mutationFn: async ({
      title,
      content,
      tags,
      file,
    }: {
      title: string;
      content: string;
      tags: string[];
      file: File;
    }) => {
      // 1️⃣ 먼저 이미지 업로드
      const imageUrl = await uploadImage(file);

      // 2️⃣ 업로드된 URL로 LP 생성
      return createLp({
        title,
        content,
        thumbnail: imageUrl,
        tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      onClose();
    },
    onError: (error) => {
      console.error("❌ LP 생성 실패:", error);
      alert("LP 생성 중 오류가 발생했습니다.");
    },
  });
}
