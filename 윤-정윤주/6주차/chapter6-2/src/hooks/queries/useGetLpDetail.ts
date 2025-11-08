import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import type { Lp } from "../../types/lp";

export default function useGetLpDetail(lpid: number | string) {
    return useQuery<Lp, Error>({
        queryKey: ["lp", lpid],
        queryFn: () => getLpDetail(Number(lpid)),
        enabled: !!lpid,
    });
}
