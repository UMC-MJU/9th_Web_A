import axios from "axios";
import { useEffect, useState } from "react";

// @param url - 요청할 API 주소
// @param deps - 의존성 배열 (URL, params 등)
export function useCustomFetch<T>(url: string, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!url) return;  // URL이 유효하지 않으면 네트워크 호출 막음
        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                const response = await axios.get<T>(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });
                setData(response.data);  // 성공 시 상태에 데이터 저장
            } catch(error) {
                console.log(error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, deps);  // deps가 바뀔 때마다 재요청

    return { data, isPending, isError };
}