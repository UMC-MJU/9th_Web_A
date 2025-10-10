// src/hooks/useCustomFetch.ts
import { useState, useEffect } from "react";
import axios from "axios";

export function useCustomFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return; // url이 없으면 실행 X
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      try {
        const res = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        setData(res.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [url]); // URL 변경 시 재요청

  return { data, isPending, isError };
}
