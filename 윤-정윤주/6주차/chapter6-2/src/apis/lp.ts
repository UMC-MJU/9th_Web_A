import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { Lp, ResponseLpListDto } from "../types/lp";

// LP 목록 조회
export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", { params: paginationDto });
    return data;
};

// LP 상세 조회
export const getLpDetail = async (lpid: number): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
    // API 응답 구조: { json: { status, message, statusCode, data: {...} } }
    // 실제 LP 데이터는 data.data에 있음
    return data.data;
};