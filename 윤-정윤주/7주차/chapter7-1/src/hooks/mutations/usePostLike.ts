import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
    return useMutation({
        // data -> API 성공 응답 데이터
        // variables -> mutationFn에 전달한 변수
        // context -> onMutate에서 반환한 값
        mutationFn: postLike,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, data.data.lpId],
                exact: true,
            });
        },

        // error: (error, variables, context) => {}
        // error: 요청 실패 시 발생한 에러
        // variables: mutationFn에 전달한 변수
        // context: onMutate에서 반환한 값

        // 요청 시작 직전에 실행되는 함수
        // Optimistic Update(낙관적 업데이트) 구현에 사용
        // onMutate: (variables) => {return {...}},
    });
}

export default usePostLike;