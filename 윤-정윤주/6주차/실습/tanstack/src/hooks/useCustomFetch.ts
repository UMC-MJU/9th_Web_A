import { useEffect, useState } from "react";

export const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect((): void => {
        const fetchData = async () => {
            setIsPending(true);
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json() as T;
                setData(data);
            } catch (error) {
                setIsError(true);
                console.log(error);
            } finally {
                setIsPending(false);
            }
        };
        fetchData();
    }, [url]);

    return { data, isPending, isError };
};