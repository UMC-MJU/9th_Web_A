// src/hooks/mutations/useCreateLp.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

export const useCreateLp = (onClose: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.post("/v1/lps", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      alert("LP가 성공적으로 등록되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
    onError: (error) => {
      console.error(error);
      alert("LP 등록 중 오류가 발생했습니다.");
    },
  });
};
