import { useMutation } from "@tanstack/react-query";
import { getMyInfo, updateMyInfo, type UpdateUserPayload } from "../../apis/auth";

const useUpdateUser = () => {
    return useMutation({
        mutationFn: (payload: UpdateUserPayload) => updateMyInfo(payload),
        onSuccess: async () => {
        // 수정 후 사용자 정보 최신화
        await getMyInfo();
        },
    });
};

export default useUpdateUser;
