import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/Ip";

export const useGetLpDetail = (lpid: number) => {
  return useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(lpid),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 3,
  });
};
