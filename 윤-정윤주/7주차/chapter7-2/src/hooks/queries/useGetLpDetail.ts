import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import type { Lp } from "../../types/lp";

export default function useGetLpDetail(lpId: number | string) {
    return useQuery<Lp, Error>({
        queryKey: ["lp", lpId],
        queryFn: () => getLpDetail({ lpId: Number(lpId) }),
        enabled: !!lpId,
    });
}
