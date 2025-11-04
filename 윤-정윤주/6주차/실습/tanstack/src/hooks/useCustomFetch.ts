// import { useEffect, useMemo, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

// const STALE_TIME= 5 * 60 * 1_000;   // 5분

// const  MAX_RETRIES = 3;
// // 1초마다 재시도
// const INITIAL_RETRY_DELAY = 1_000;

// // 로컬스토리지에 저장할 데이터의 구조
// interface CacheEntry<T> {
//     data: T;
//     lastFetched: number;   // 마지막으로 데이터를 가져온 시점의 타임스탬프
// }

export const useCustomFetch = <T>(url: string) => {
    return useQuery({
        queryKey: [url],

        queryFn: async ({ signal }) : Promise<any> => {
            const response = await fetch(url, { signal });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            return response.json() as Promise<T>;
        },

        retry: 3,

        // 지수 백오프 전략
        retryDelay: (attemptIndex) => {
            return Math.min(1000 * Math.pow(2, attemptIndex), 30_000);
        },

        staleTime: 5 * 60 * 1_000,

        // 쿼리가 사용되지 않은 채로 10분이 지나면 캐시에서 제거됨
        gcTime: 10 * 60 * 1_000,

    })
//     const [data, setData] = useState<T | null>(null);
//     const [isPending, setIsPending] = useState<boolean>(false);
//     const [isError, setIsError] = useState<boolean>(false);

//     // URL을 localStorage 키로 사용 (useMemo로 불필요한 재계산 방지)
//     const storageKey = useMemo(() => url, [url]);

//     const abortControllerRef = useRef<AbortController | null>(null);

//     const retryTimeoutRef = useRef<number | null>(null);

//     useEffect(() => {
//         abortControllerRef.current = new AbortController();
//         setIsError(false);

//         const fetchData = async (currentRetry = 0) => {
//             const currentTime = new Date().getTime();
//             const cachedItem = localStorage.getItem(storageKey);

//             // 캐시 데이터 확인, 신선도 검증
//             if (cachedItem) {
//                 try {
//                     // 로컬 스토리지에서 가져온 문자열을 객체로 역직렬화
//                     const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

//                     // 캐시가 신선한 경우 (STALE_TIME 이내) 네트워크 요청 생략
//                     if (currentTime - cachedData.lastFetched < STALE_TIME) {
//                         setData(cachedData.data);
//                         setIsPending(false);
//                         console.log('캐시된 데이터 사용', url);
//                         return;   // 네트워크 요청 없이 함수 종료
//                     }

//                     // 캐시가 오래된 경우: 먼저 보여주고 백그라운드에서 새 데이터 가져오기
//                     // 이를 통해 사용자에게 즉시 콘텐츠를 보여주며 UX 개선
//                     setData(cachedData.data);
//                     console.log('만료된 캐시 데이터 사용', url);
//                 } catch {
//                     // JSON 파싱 오류 발생 시 (캐시 데이터 손상)
//                     localStorage.removeItem(storageKey);
//                     console.warn('캐시 에러: 캐시 삭제', url);
//                 }
//             }

//             setIsPending(true);

//             try {
//                 const response = await fetch(url, {
//                     signal: abortControllerRef.current?.signal,
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch data');
//                 }

//                 const newData = await response.json() as T;
//                 setData(newData);

//                 const newCacheEntry: CacheEntry<T> = {
//                     data: newData,
//                     lastFetched: new Date().getTime(),  // 현재 시간을 타임스탬프로 저장
//                 };

//                 localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
//             } catch (error) {

//                 if (error instanceof Error && error.name === 'AbortError') {
//                     console.log('요청 취소됨', url);

//                     return;
//                 }

//                 if (currentRetry < MAX_RETRIES) {
//                     // 1 -> 2 -> 4 -> 8
//                     const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
//                     console.log(
//                         `재시도, ${
//                             currentRetry + 1
//                         }/${MAX_RETRIES} Retrying ${retryDelay}ms later`
//                     );

//                     retryTimeoutRef.current = setTimeout(() => {
//                         fetchData(currentRetry + 1);
//                     }, retryDelay);
//                 } else {
//                     // 최대 재시도 횟수 초과
//                     setIsError(true);
//                     setIsPending(false);
//                     console.log('최대 재시도 횟수 초과', url);
//                     return;
//                 }

//                 setIsError(true);
//                 console.log(error);
//             } finally {
//                 setIsPending(false);
//             }
//         };
//         fetchData();

//         return () => {
//             abortControllerRef.current?.abort();

//             // 예약된 재시도 타이머 취소
//             if (retryTimeoutRef.current !== null) {
//                 clearTimeout(retryTimeoutRef.current);
//                 retryTimeoutRef.current = null;
//             }
//         }
//     }, [url, storageKey]);

//     return { data, isPending, isError };
};