import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo, type UpdateUserPayload } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfoDto } from "../../types/auth";

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateMyInfo(payload),
    
    // 낙관적 업데이트: 서버 응답 전에 UI 즉시 변경
    onMutate: async (newData) => {
      // 진행 중인 쿼리 취소 (충돌 방지)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      // 이전 데이터 백업 (롤백용)
      const previousData = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      // 캐시를 즉시 업데이트 (낙관적 업데이트)
      if (previousData) {
        queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], {
          ...previousData,
          data: {
            ...previousData.data,
            ...(newData.name !== undefined && { name: newData.name }),
            ...(newData.bio !== undefined && { bio: newData.bio }),
            ...(newData.avatar !== undefined && { avatar: newData.avatar }),
          },
        });
      }

      // 롤백용 이전 데이터 반환
      return { previousData };
    },

    // 에러 발생 시 이전 상태로 롤백
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousData);
      }
      console.error("사용자 정보 업데이트 실패:", err);
    },

    // 성공 시 최신 데이터로 갱신
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
};

export default useUpdateUser;