// src/hooks/mutations/useUpdateProfile.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

interface UpdateProfileData {
  name?: string;
  bio?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  // 🔥 서버로 PATCH 요청 보내는 함수
  const updateUserInfo = async (newData: UpdateProfileData) => {
    const res = await axiosInstance.patch("/v1/users", newData);
    return res.data;
  };

  return useMutation({
    mutationFn: updateUserInfo,

    // 🔥 낙관적 업데이트
    onMutate: async (newData) => {
      await queryClient.cancelQueries(["myInfo"]);

      const previous = queryClient.getQueryData(["myInfo"]);

      queryClient.setQueryData(["myInfo"], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          name: newData.name ?? old.data.name,
          bio: newData.bio ?? old.data.bio,
        },
      }));

      return { previous };
    },

    // 실패 → 롤백
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["myInfo"], context.previous);
      }
    },

    // 성공 → 최신 정보 refetch
    onSuccess: () => {
      queryClient.invalidateQueries(["myInfo"]);
    },
  });
};
